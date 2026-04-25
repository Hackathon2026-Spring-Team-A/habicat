import time
from datetime import date, timedelta
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from db.models import User, Base
from db.database import get_db, engine

app = FastAPI()

@app.post("/stamp")

def stamp(user_id: int, db: Session = Depends(get_db)):
    """
    指定されたユーザーのスタンプ（習慣記録）を押す。
    - 当日すでに押している場合はスキップ
    - 前日に押していれば継続日数を加算、それ以外はリセット
    """

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return {"error": "user not found"}

    today = date.today()

    if user.last_stamped_date == today:
        return {"message": "already stamped"}

    if user.last_stamped_date == today - timedelta(days=1):
        user.streak_days += 1

    else:
        user.streak_days = 0

    user.last_stamped_date = today

    db.commit()

    return {"streak_days": user.streak_days}

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
