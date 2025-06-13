# Telegram Bot Configuration

# Your bot token from BotFather
BOT_TOKEN = "7367269425:AAFMjHhzgQdnxiR8TE-IeZNqt_tH64w_R2k"

# Your bot username (with @ prefix)
BOT_USERNAME = "@TWETestBot"

# Set this to True to have the bot respond to all messages in group chats
# Set to False to only respond when mentioned or in private chats
RESPOND_TO_ALL_MESSAGES = True

# Connection settings
USE_DIRECT_IP = False
API_TELEGRAM_IP = "149.154.167.220" 
SKIP_SSL_VERIFY = False

# Special groups configuration
# These groups will have custom buttons with specific referral links
SPECIAL_GROUPS = {
    # Group ID: {referral_configs}
    -1002155968676: {
        "buy_sell_link": "https://t.me/Tonnel_Network_bot/gifts?startapp=ref_1251203296",
        "portal_link": "https://t.me/portals/market?startapp=1251203296"
    },
    -1001891015899: {
        "buy_sell_link": "https://t.me/tonnel_network_bot/gifts?startapp=ref_1109811477",
        "portal_link": "https://t.me/portals/market?startapp=1109811477"
    }
}

# Default buy/sell link for regular groups and private chats
DEFAULT_BUY_SELL_LINK = "https://t.me/tonnel_network_bot/gifts?startapp=ref_7660176383"