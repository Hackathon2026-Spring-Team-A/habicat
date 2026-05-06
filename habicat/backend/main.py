import time
from datetime import date, timedelta
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from apscheduler.schedulers.background import BackgroundScheduler
import bcrypt
from db.models import User, Report, Base
from db.database import get_db, engine, SessionLocal

app = FastAPI()
scheduler = BackgroundScheduler(timezone="Asia/Tokyo")


def reset_streak_if_not_submitted():
    """昨日 is_submit=True のレポートがないユーザーの streak_days を 0 にする"""
    db = SessionLocal()
    try:
        yesterday = date.today() - timedelta(days=1)
        users = db.query(User).filter(User.streak_days > 0).all()
        for user in users:
            submitted = (
                db.query(Report)
                .filter(Report.user_id == user.id, Report.training_date == yesterday, Report.is_submit == True)
                .first()
            )
            if not submitted:
                user.streak_days = 0
        db.commit()
    finally:
        db.close()

class LoginRequest(BaseModel):
    email: str
    password: str

class ReportSubmitRequest(BaseModel):
    content: str | None = None
    training_date: date | None = None


@app.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not bcrypt.checkpw(req.password.encode(), user.password.encode()):
        raise HTTPException(status_code=401, detail="メールアドレスまたはパスワードが正しくありません")
    return {
        "user_id": user.id,
        "name": user.name,
        "email": user.email,
        "streak_days": user.streak_days,
        "menu_id": user.menu_id,
    }


@app.post("/stamp/{user_id}")
def submit_report(user_id: int, req: ReportSubmitRequest, db: Session = Depends(get_db)):
    """
    運動記録を提出し、スタンプ（継続日数）を更新する。
    - 対象日の report がなければ新規作成、あれば content を更新
    - 当日すでにスタンプ済みの場合は継続日数を変更しない
    - 前日にスタンプ済みなら streak_days を加算、それ以外はリセット
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="user not found")

    target_date = req.training_date or date.today()

    # 継続日数更新（対象日初回のみ）
    already_stamped = user.last_stamped_date == target_date
    if not already_stamped:
        yesterday = target_date - timedelta(days=1)
        yesterday_report = (
            db.query(Report)
            .filter(Report.user_id == user_id, Report.training_date == yesterday, Report.is_submit == True)
            .first()
        )
        # 昨日、レポート提出したか
        if yesterday_report:
            user.streak_days += 1
        else:
            user.streak_days = 1
        user.last_stamped_date = target_date

    # レポート作成 or 更新
    report = (
        db.query(Report)
        .filter(Report.user_id == user_id, Report.training_date == target_date)
        .first()
    )

    if report:
        report.content = req.content
        report.is_submit = True
    else:
        report = Report(
            user_id=user_id,
            training_date=target_date,
            content=req.content,
            is_submit=True,
        )
        db.add(report)

    db.commit()
    db.refresh(report)

    return {
        "id": report.id,
        "user_id": report.user_id,
        "training_date": report.training_date,
        "content": report.content,
        "is_submit": report.is_submit,
        "streak_days": user.streak_days,
        "already_stamped": already_stamped,
    }

@app.on_event("startup")
def startup():
    """
    アプリ起動時に(テーブルが存在しない場合のみ)テーブルを作成する。
    MySQLの起動が遅い場合に備え、3秒おきに最大10回リトライする。
    """
    for i in range(10):
        try:
            Base.metadata.create_all(bind=engine)
            break
        except OperationalError:
            if i == 9:
                raise
            time.sleep(3)

    scheduler.add_job(reset_streak_if_not_submitted, "cron", hour=0, minute=0)
    scheduler.start()


@app.on_event("shutdown")
def shutdown():
    scheduler.shutdown()