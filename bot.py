import os
import time
import mysql.connector
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    ContextTypes,
    MessageHandler,
    CallbackQueryHandler,
    filters
)

# === Configuration ===
BOT_TOKEN = os.getenv("BOT_TOKEN")
ADMIN_ID = int(os.getenv("ADMIN_ID", "800092886"))
VIDEO_FILE_ID = os.getenv("VIDEO_FILE_ID")

# MySQL Referrals DB config (from your environment variables)
REF_DB_CONFIG = {
    "host": os.getenv("MYSQL_REF_HOST"),
    "port": int(os.getenv("MYSQL_REF_PORT", "3306")),
    "user": os.getenv("MYSQL_REF_USER"),
    "password": os.getenv("MYSQL_REF_PASSWORD"),
    "database": os.getenv("MYSQL_REF_DATABASE"),
}

print("=== Bot Starting ===")
print(f"BOT_TOKEN: {'set' if BOT_TOKEN else 'NOT SET'}")
print(f"VIDEO_FILE_ID: {'set' if VIDEO_FILE_ID else 'NOT SET'}")
print(f"REF_DB_CONFIG: {REF_DB_CONFIG}")

# === Referrals DB Logic ===
def add_referral(referrer_id, invited_id, invited_name, invited_photo):
    print(f"add_referral called with: referrer_id={referrer_id}, invited_id={invited_id}, invited_name={invited_name}, invited_photo={invited_photo}")
    try:
        conn = mysql.connector.connect(**REF_DB_CONFIG)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT IGNORE INTO referrals (referrer_id, invited_id, invited_name, invited_photo, created_at) VALUES (%s, %s, %s, %s, %s)",
            (referrer_id, invited_id, invited_name, invited_photo, int(time.time()))
        )
        conn.commit()
        cursor.close()
        conn.close()
        print(f"Referral recorded: {referrer_id} -> {invited_id} ({invited_name}) with photo {invited_photo}")
    except Exception as e:
        print(f"Error recording referral: {e}")

# === Command Handlers ===
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    print(f"/start called by user: {user.id}, username: {user.username}, first_name: {user.first_name}")

    # Fetch profile photo file_id
    file_id = ""
    try:
        photos = await context.bot.get_user_profile_photos(user.id, limit=1)
        print(f"Fetched profile photos for user {user.id}: total_count={photos.total_count}")
        if photos.total_count > 0:
            file_id = photos.photos[0][0].file_id
            print(f"Using file_id: {file_id}")
    except Exception as e:
        print(f"Could not fetch profile photo: {e}")

    # Handle referral if any
    if context.args:
        print(f"start args: {context.args}")
    if context.args and context.args[0].startswith("ref_"):
        try:
            referrer_id = int(context.args[0].replace("ref_", ""))
            print(f"Parsed referrer_id: {referrer_id}")
            if referrer_id != user.id:
                add_referral(referrer_id, user.id, user.username or user.first_name or "", file_id)
            else:
                print("Referrer ID is the same as invited user ID. Skipping.")
        except ValueError:
            print("Invalid referral ID in /start args.")

    welcome_msg = (
        "🎁 Welcome to Gift Catalog!\n\n"
        "All Telegram gifts, in one sleek catalog.\n"
        "Browse, admire, and explore every collectible gift ever made on Telegram — all in one place.\n\n"
        "Tap the blue button below to get started!"
    )

    keyboard = [
        [InlineKeyboardButton("Join Gift Catalog", web_app=WebAppInfo(url="https://gift-catalog-1-0-git-main-yust777s-projects.vercel.app/"))],
        [InlineKeyboardButton("Community 🎁", url="tg://resolve?domain=Gift_Catalog")]
    ]

    try:
        await context.bot.send_animation(
            chat_id=update.effective_chat.id,
            animation=VIDEO_FILE_ID,
            caption=welcome_msg,
            parse_mode="Markdown",
            reply_markup=InlineKeyboardMarkup(keyboard)
        )
        print("Sent welcome animation.")
    except Exception as e:
        print(f"Animation error: {e}")
        try:
            await context.bot.send_message(
                chat_id=update.effective_chat.id,
                text=welcome_msg,
                parse_mode="Markdown",
                reply_markup=InlineKeyboardMarkup(keyboard)
            )
            print("Sent welcome message (fallback).")
        except Exception as e2:
            print(f"Message error: {e2}")

async def users(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print(f"/users called by user: {update.effective_user.id}")
    await update.message.reply_text("User listing is not implemented in this minimal example.")

async def broadcast(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print(f"/broadcast called by user: {update.effective_user.id}")
    await update.message.reply_text("Broadcast feature is under development.")

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print(f"Received message from user: {update.effective_user.id}, text: {update.message.text}")
    await update.message.reply_text("Send /start to begin or explore our catalog.")

async def button_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print(f"Button pressed by user: {update.effective_user.id}")
    await update.callback_query.answer("Coming soon!")

# === Bot Entry Point ===
def main():
    print("Starting bot polling...")
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    # Commands
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("users", users))
    app.add_handler(CommandHandler("broadcast", broadcast))

    # Messages & Callbacks
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    app.add_handler(CallbackQueryHandler(button_handler))

    print("🤖 Bot is running on Railway...")
    app.run_polling()

if __name__ == "__main__":
    main() 