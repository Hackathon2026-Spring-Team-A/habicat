import time
from datetime import date, timedelta
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from db.database import get_db, engine
from db.models import User, Report, Base

app = FastAPI()


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
