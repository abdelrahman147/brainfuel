import logging
import asyncio
from telegram import Update, InlineKeyboardMarkup, InlineKeyboardButton, InputMediaPhoto
from telegram.ext import ContextTypes
from telegram.error import BadRequest
from telegram.constants import ParseMode

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
# Reduce logging for HTTP requests
logging.getLogger("httpx").setLevel(logging.WARNING)
logger = logging.getLogger(__name__)

# Import special groups configuration
try:
    from bot_config import SPECIAL_GROUPS, DEFAULT_BUY_SELL_LINK
except ImportError:
    # Default values if config file is missing
    SPECIAL_GROUPS = {}
    DEFAULT_BUY_SELL_LINK = "https://t.me/tonnel_network_bot/gifts?startapp=ref_7660176383"

async def callback_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle callback queries."""
    query = update.callback_query
    await query.answer()  # Answer callback query to stop loading animation
    
    callback_data = query.data
    logger.info(f"Received callback query: {callback_data}")
    
    # Check if this is a delete button callback
    if callback_data == "delete" or callback_data.startswith("delete_") or callback_data.startswith("inline_delete_"):
        try:
            user_id = update.effective_user.id
            
            # Check if this is an inline message delete request (inline_message_id is present)
            if query.inline_message_id:
                # This is an inline message deletion
                try:
                    await context.bot.edit_message_text(
                        text="This message has been deleted.",
                        inline_message_id=query.inline_message_id
                    )
                    logger.info(f"Inline message {query.inline_message_id} deleted by user {user_id}")
                except Exception as e:
                    logger.error(f"Error deleting inline message: {e}")
                    await query.answer("Error deleting message", show_alert=True)
            
            # Handle inline_delete_ format (used for inline messages)
            elif callback_data.startswith("inline_delete_"):
                try:
                    # Extract inline_message_id from callback data
                    inline_message_id = callback_data[13:]  # Remove "inline_delete_" prefix
                    
                    await context.bot.edit_message_text(
                        text="This message has been deleted.",
                        inline_message_id=inline_message_id
                    )
                    logger.info(f"Inline message {inline_message_id} deleted by user {user_id}")
                except Exception as e:
                    logger.error(f"Error deleting inline message: {e}")
                    await query.answer("Error deleting message", show_alert=True)
            
            # Handle special delete_[inline_message_id] format (legacy format)
            elif callback_data.startswith("delete_") and not any(c.isalpha() for c in callback_data[7:]):
                # This might be an inline message ID
                try:
                    # Try to extract inline_message_id from callback data
                    inline_message_id = callback_data[7:]  # Remove "delete_" prefix
                    
                    # Check if the data after "delete_" is long enough to be an inline message ID
                    # Inline message IDs are usually long strings, while user IDs are shorter
                    if len(inline_message_id) > 10:  # Inline message IDs are typically quite long
                        await context.bot.edit_message_text(
                            text="This message has been deleted.",
                            inline_message_id=inline_message_id
                        )
                        logger.info(f"Inline message {inline_message_id} deleted by user {user_id}")
                    else:
                        # This is likely a user ID, handle as regular message
                        await regular_message_delete(update, context, user_id)
                except Exception as e:
                    logger.error(f"Error handling delete_{inline_message_id}: {e}")
                    # If inline message deletion fails, try regular message deletion as fallback
                    await regular_message_delete(update, context, user_id)
            else:
                # Regular message deletion
                await regular_message_delete(update, context, user_id)
                
        except Exception as e:
            logger.error(f"Error in delete handler: {e}")
            await query.answer("Error processing delete request", show_alert=True)
    
    # Check if this is from an inline query callback for a gift
    elif callback_data.startswith("gift_"):
        # Extract gift name from callback data
        gift_file_name = callback_data[5:]  # Remove "gift_" prefix
        # Convert file format name to display name
        gift_name = gift_file_name.replace("_", " ")
        
        # Apply rate limiting for specific gift
        try:
            user_id = update.effective_user.id
            
            # For inline queries, effective_chat is None, use a special chat_id
            if query.inline_message_id:
                # For inline mode, use a special chat ID
                chat_id = 0  # Special value for inline mode
            else:
                chat_id = update.effective_chat.id
            
            from rate_limiter import can_user_request
            can_request, seconds_remaining = can_user_request(user_id, chat_id, gift_name)
            
            if not can_request:
                # User is rate limited for this gift
                if seconds_remaining > 0:
                    # Only notify in private chats to avoid spam
                    if not query.inline_message_id:  # Skip for inline mode
                        is_private = update.effective_chat.type == "private"
                        
                        if is_private:
                            await query.message.reply_text(
                                f"⏱️ You can request each gift once per minute. Please wait {seconds_remaining} seconds to request {gift_name} again.",
                                reply_to_message_id=query.message.message_id
                            )
                
                # Still delete the original button message to prevent spam (but not for inline mode)
                if not query.inline_message_id:
                    try:
                        await query.message.delete()
                    except Exception as e:
                        logger.error(f"Error deleting original message: {e}")
                
                return
        except ImportError:
            # Rate limiter not available, continue without rate limiting
            logger.warning("Rate limiter not available, continuing without rate limiting")
        except Exception as e:
            # Log any other errors but continue processing
            logger.error(f"Error in rate limiting: {e}")
        
        try:
            # Handle messaging differently depending on whether this is from inline query or not
            if query.inline_message_id:
                # This is from an inline query result
                logger.info(f"Processing inline query callback for {gift_name}")
                
                # First update the inline message to show loading
                try:
                    await context.bot.edit_message_text(
                        text=f"📊 Generating price card for {gift_name}...",
                        inline_message_id=query.inline_message_id
                    )
                except Exception as e:
                    logger.error(f"Error updating inline message: {e}")
                
                # Generate a fresh gift card with timestamp to ensure it's new
                from telegram_bot import generate_timestamped_card
                card_path = generate_timestamped_card(gift_file_name)
                
                if not card_path:
                    # If we failed to generate the card, update the message
                    await context.bot.edit_message_text(
                        text=f"❌ Sorry, couldn't generate price card for {gift_name}.",
                        inline_message_id=query.inline_message_id
                    )
                    return
                
                # Upload the image to Catbox - this is necessary for inline mode
                from image_uploader import upload_image_to_catbox
                image_url = upload_image_to_catbox(card_path)
                
                if not image_url:
                    await context.bot.edit_message_text(
                        text=f"❌ Sorry, couldn't upload the price card image for {gift_name}.",
                        inline_message_id=query.inline_message_id
                    )
                    return
                
                # Get the gift price data
                try:
                    import new_card_design
                    gift_data = new_card_design.fetch_gift_data(gift_name)
                    if gift_data:
                        price_usd = float(gift_data.get("priceUsd", 0))
                        price_ton = float(gift_data.get("priceTon", 0))
                        change_pct = float(gift_data.get("changePercentage", 0))
                        
                        # Format the change percentage with sign
                        change_sign = "+" if change_pct >= 0 else ""
                        change_formatted = f"{change_sign}{change_pct:.2f}"
                        
                        caption = f"💎 <b>{gift_name}</b> 💎\n\n{price_ton:.1f} TON = ${price_usd:,.0f} USD ({change_formatted}%)"
                    else:
                        caption = f"💎 <b>{gift_name}</b> 💎"
                except Exception as e:
                    logger.error(f"Error formatting price data: {e}")
                    caption = f"💎 <b>{gift_name}</b> 💎"
                
                # Create message with image preview
                # The invisible link trick with a zero-width space after href=
                message_text = f"<a href='{image_url}'> </a>{caption}"
                
                # Send the message with image preview
                try:
                    result = await context.bot.edit_message_text(
                        text=message_text,
                        inline_message_id=query.inline_message_id,
                        parse_mode=ParseMode.HTML,
                        disable_web_page_preview=False,  # Important: enable preview
                        reply_markup=InlineKeyboardMarkup([
                            [InlineKeyboardButton("💰 Buy/Sell Gifts", url=DEFAULT_BUY_SELL_LINK)],
                            [InlineKeyboardButton("🗑️ Delete", callback_data=f"inline_delete_{query.inline_message_id}")]
                        ])
                    )
                    logger.info(f"Successfully sent gift card for {gift_name} with image preview")
                except Exception as e:
                    logger.error(f"Error sending gift card: {e}")
                    # If failed, try to send just text
                    try:
                        await context.bot.edit_message_text(
                            text=caption,
                            inline_message_id=query.inline_message_id,
                            parse_mode=ParseMode.HTML,
                            reply_markup=InlineKeyboardMarkup([
                                [InlineKeyboardButton("💰 Buy/Sell Gifts", url=DEFAULT_BUY_SELL_LINK)],
                                [InlineKeyboardButton("🗑️ Delete", callback_data=f"inline_delete_{query.inline_message_id}")]
                            ])
                        )
                    except Exception as nested_error:
                        logger.error(f"Error in fallback message: {nested_error}")
            else:
                # This is from a regular message
                logger.info(f"Processing regular message callback for {gift_name}")
                
                # Send a loading message
                loading_message = await query.message.reply_text(f"📊 Generating price card for {gift_name}...")
                
                # Generate the gift card
                from telegram_bot import generate_gift_price_card
                card_path = await generate_gift_price_card(gift_file_name)
                
                if not card_path:
                    # If we failed to generate the card, update the message
                    await loading_message.edit_text(f"❌ Sorry, couldn't generate price card for {gift_name}.")
                    return
                
                # Check if this is a special group with custom buttons
                # Get the current chat ID
                chat_id = update.effective_chat.id
                
                # Create keyboard based on the chat ID
                keyboard = []
                
                # Check if this is a special group that needs custom buttons
                if chat_id in SPECIAL_GROUPS:
                    # This is a special group, use custom referral links
                    group_config = SPECIAL_GROUPS[chat_id]
                    buy_sell_link = group_config["buy_sell_link"]
                    portal_link = group_config["portal_link"]
                    
                    # Create three buttons for special groups
                    keyboard = [
                        [InlineKeyboardButton("💰 Buy/Sell Gifts", url=buy_sell_link),
                         InlineKeyboardButton("🌐 Portal", url=portal_link)],
                        [InlineKeyboardButton("🗑️ Delete", callback_data="delete")]
                    ]
                else:
                    # Regular chat, use default configuration with just two buttons
                    keyboard = [
                        [InlineKeyboardButton("💰 Buy/Sell Gifts", url=DEFAULT_BUY_SELL_LINK)],
                        [InlineKeyboardButton("🗑️ Delete", callback_data="delete")]
                    ]
                
                # Send the photo with the appropriate keyboard
                sent_message = await query.message.reply_photo(
                    photo=open(card_path, 'rb'),
                    caption=f"🎁 {gift_name} Price Card",
                    reply_markup=InlineKeyboardMarkup(keyboard)
                )
                
                # Register message ownership in database for delete permission
                from rate_limiter import register_message
                register_message(user_id, chat_id, sent_message.message_id)
                
                # Delete the loading message
                await loading_message.delete()
                
                # Delete the original message with the button
                try:
                    await query.message.delete()
                except Exception as e:
                    logger.error(f"Error deleting original message: {e}")
                
        except Exception as e:
            logger.error(f"Error processing gift callback: {e}")
            # Try to notify the user
            try:
                if query.inline_message_id:
                    await context.bot.edit_message_text(
                        text=f"❌ Error generating price card: {e}",
                        inline_message_id=query.inline_message_id
                    )
                else:
                    await query.message.reply_text(f"❌ Error generating price card: {e}")
            except:
                pass
            
    # Other callback types like category_, page_, etc. would be handled here
    elif callback_data.startswith("category_"):
        category = callback_data[9:]  # Remove "category_" prefix
        from telegram_bot import get_gift_keyboard
        reply_markup = get_gift_keyboard(category)
        
        # Instead of editing the message, send a new message and delete the old one
        await query.message.reply_text(
            f"Here are gifts in the {category} category:", 
            reply_markup=reply_markup
        )
        
        # Delete the original message with the button
        try:
            await query.message.delete()
        except Exception as e:
            logger.error(f"Error deleting original message: {e}")
    
    elif callback_data.startswith("page_"):
        # Handle pagination for gift browsing
        parts = callback_data.split("_")
        page = int(parts[1])
        category = parts[2] if len(parts) > 2 else None
        
        from telegram_bot import get_gift_keyboard
        reply_markup = get_gift_keyboard(category, page)
        
        # Update the text based on whether we're showing a category or all gifts
        message_text = ""
        if category and category != "None":
            message_text = f"Here are gifts in the {category} category (page {page+1}):"
        else:
            message_text = f"Browsing all gifts (page {page+1}):"
            
        # Instead of editing the message, send a new message and delete the old one
        await query.message.reply_text(message_text, reply_markup=reply_markup)
        
        # Delete the original message with the button
        try:
            await query.message.delete()
        except Exception as e:
            logger.error(f"Error deleting original message: {e}")
    
    elif callback_data == "back_to_categories":
        from telegram_bot import get_category_keyboard
        reply_markup = get_category_keyboard()
        
        # Instead of editing the message, send a new message and delete the old one
        await query.message.reply_text("Choose a gift category to browse:", reply_markup=reply_markup)
        
        # Delete the original message with the button
        try:
            await query.message.delete()
        except Exception as e:
            logger.error(f"Error deleting original message: {e}")
    
    elif callback_data == "random_gift":
        # Show a random gift
        from telegram_bot import random
        from telegram_bot import names
        from telegram_bot import send_gift_card
        
        # Choose random gift name
        gift_name = random.choice(names)
        
        # First send a loading message
        loading_message = await query.message.reply_text(f"🎲 Generating random gift: {gift_name}...")
        
        # Generate and send the gift card
        await send_gift_card(update, context, gift_name)
        
        # Delete the loading message
        await loading_message.delete()
        
        # Delete the original message with the button
        try:
            await query.message.delete()
        except Exception as e:
            logger.error(f"Error deleting original message: {e}")

async def regular_message_delete(update, context, user_id):
    """Handle regular (non-inline) message deletion"""
    query = update.callback_query
    message_id = query.message.message_id
    chat_id = update.effective_chat.id
    
    try:
        # Check if this user can delete this message
        from rate_limiter import can_delete_message
        can_delete = can_delete_message(user_id, chat_id, message_id)
        logger.info(f"User {user_id} attempting to delete message {message_id}, allowed: {can_delete}")
        
        if can_delete:
            # User is authorized to delete the message
            await query.message.delete()
            logger.info(f"Message {message_id} deleted successfully by user {user_id}")
        else:
            # Notify that only the requester can delete the message
            await query.answer("Only the user who requested this card can delete it", show_alert=True)
            logger.warning(f"Delete attempt by unauthorized user {user_id} for message {message_id}")
    except Exception as del_error:
        # If there's an error checking permissions, try to delete anyway
        logger.error(f"Error checking message permissions: {del_error}")
        try:
            await query.message.delete()
            logger.info(f"Message {message_id} deleted after permission check error")
        except Exception as final_error:
            logger.error(f"Final error deleting message: {final_error}")
            await query.answer("Error deleting message", show_alert=True) 