# tgbot.py

from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackContext
from telegram import Update, ReplyKeyboardMarkup

import requests

# === Настройки ===
BOT_TOKEN = "7874923181:AAHTJCTtodQcpy_x0_weh7qmf9J55Y_lhZA"
FASTAPI_URL = "http://127.0.0.1:8001"

# === Клавиатура ===
MENU_KEYBOARD = [
    ["📋 Посмотреть данные"],
    ["✅ Изменить статус задачи", "✅ Изменить статус дейлика"],
    ["🔁 Увеличить привычку"],
    ["🔄 Обновить меню"]
]
markup = ReplyKeyboardMarkup(MENU_KEYBOARD, resize_keyboard=True)

# === Команда /start ===
def start(update: Update, context):
    update.message.reply_text("Введите user_id:")
    context.user_data["state"] = "awaiting_user_id"


# === Обработка текстовых сообщений ===
def handle_input(update: Update, context: CallbackContext):
    state = context.user_data.get("state")
    user_id = context.user_data.get("user_id")

    if state == "awaiting_user_id":
        text = update.message.text.strip()
        if not text.isdigit():
            update.message.reply_text("Введите корректный user_id (число):")
            return

        # Сохраняем user_id
        context.user_data["user_id"] = int(text)
        update.message.reply_text("Выберите действие:", reply_markup=markup)
        context.user_data["state"] = "main_menu"

    elif state == "toggle_task":
        task_id = update.message.text.strip()
        if not task_id.isdigit():
            update.message.reply_text("Введите корректный task_id (число):")
            return

        response = requests.patch(f"{FASTAPI_URL}/tasks/{task_id}/toggle")
        if response.status_code == 200:
            data = response.json()
            is_done = data.get("is_done", False)
            update.message.reply_text(f"Статус задачи обновлён: {'✅ Выполнено' if is_done else '❌ Не выполнено'}")
        else:
            update.message.reply_text("Задача не найдена.")

        context.user_data["state"] = "main_menu"
        update.message.reply_text("Выберите действие:", reply_markup=markup)

    elif state == "toggle_daily":
        daily_id = update.message.text.strip()
        if not daily_id.isdigit():
            update.message.reply_text("Введите корректный daily_id (число):")
            return

        response = requests.patch(f"{FASTAPI_URL}/dailies/{daily_id}/toggle")
        if response.status_code == 200:
            data = response.json()
            is_done = data.get("is_done", False)
            update.message.reply_text(f"Статус дейлика обновлён: {'✅ Выполнено' if is_done else '❌ Не выполнено'}")
        else:
            update.message.reply_text("Дейлик не найден.")

        context.user_data["state"] = "main_menu"
        update.message.reply_text("Выберите действие:", reply_markup=markup)

    elif state == "increment_habit":
        habit_id = update.message.text.strip()
        if not habit_id.isdigit():
            update.message.reply_text("Введите корректный habit_id (число):")
            return

        response = requests.patch(f"{FASTAPI_URL}/habits/{habit_id}")
        if response.status_code == 200:
            data = response.json()
            update.message.reply_text(f"Привычка '{data['name']}' увеличена до {data['times']} раз.")
        else:
            update.message.reply_text("Привычка не найдена.")

        context.user_data["state"] = "main_menu"
        update.message.reply_text("Выберите действие:", reply_markup=markup)

    elif state == "main_menu":
        choice = update.message.text.strip()

        if choice == "📋 Посмотреть данные":
            full_response = requests.get(f"{FASTAPI_URL}/users/{user_id}/full")
            if full_response.status_code != 200:
                update.message.reply_text("Ошибка: не могу получить данные пользователя.")
                return

            full_info = full_response.json()
            user = full_info["user"]

            message = f"👤 Имя: {user['login']}\n"
            message += f"🧠 Опыт: {user['score']}\n"
            message += f"💰 Монеты: {user['money']}\n"
            message += f"😊 Настроение: {user['mood']}\n\n"

            message += "📌 Задачи:\n"
            for task in full_info["tasks"]:
                status = "✅" if task.get("is_done", False) else "❌"
                message += f"{status} ID: {task['task_id']} - {task['name']}\n"

            message += "\n📅 Ежедневные задачи:\n"
            for daily in full_info["dailies"]:
                status = "✅" if daily.get("is_done", False) else "❌"
                message += f"{status} ID: {daily['daily_id']} - {daily['name']}\n"

            message += "\n🔁 Привычки:\n"
            for habit in full_info["habits"]:
                pos_neg = "➕ Положительная" if habit.get("is_positive") else "➖ Отрицательная"
                message += f"{pos_neg}: {habit['name']} ({habit['times']} раз(а))\n"

            update.message.reply_text(message)

        elif choice == "✅ Изменить статус задачи":
            update.message.reply_text("Введите ID задачи для изменения статуса:")
            context.user_data["state"] = "toggle_task"

        elif choice == "✅ Изменить статус дейлика":
            update.message.reply_text("Введите ID дейлика для изменения статуса:")
            context.user_data["state"] = "toggle_daily"

        elif choice == "🔁 Увеличить привычку":
            update.message.reply_text("Введите ID привычки для увеличения:")
            context.user_data["state"] = "increment_habit"

        elif choice == "🔄 Обновить меню":
            update.message.reply_text("Меню обновлено.", reply_markup=markup)

        else:
            update.message.reply_text("Неизвестное действие.")

# === Запуск бота ===
def main():
    updater = Updater(BOT_TOKEN, use_context=True)
    dp = updater.dispatcher

    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(MessageHandler(Filters.text & ~Filters.command, handle_input))

    print("Бот запущен...")
    updater.start_polling()
    updater.idle()


if __name__ == "__main__":
    main()