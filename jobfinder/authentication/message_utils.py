from django.conf import settings
from django.core.mail import send_mail
from .model_helper import generate_otp
# NOTE: sendSMS is not defined in this project, so you might need to mock or implement it later.
def sendSMS(api_key, full_number, sender_id, message):
    print("Mock SMS sent to", full_number)
    return True

def send_registration_otp(username, email, mobile_number):
    otp = generate_otp()
    # Save OTP somewhere (DB, cache) for later verification …
    if mobile_number:
        # Prepare SMS for india
        sender_id = getattr(settings, 'SMS_THAI_SENDER', 'YourCompany')  # e.g. “YourCompany”
        full_number = "+91" + mobile_number.lstrip("0")  # india country code +66
        message_template = getattr(settings, 'SMS_THAI_OTP_TEMPLATE', 'Hi {NAME}, your OTP is {OTP}')
        message = message_template.replace("{OTP}", otp).replace("{NAME}", username)
        api_key = getattr(settings, 'SMS_THAI_API_KEY', '')
        # send via SMS gateway
        result = sendSMS(api_key, full_number, sender_id, message)
        print("SMS OTP send result:", result)
    elif email:
        subject = "Your OTP Code"
        message = f"Hi {username},\nYour OTP is: {otp}\nIt will expire in 5 minutes."
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@example.com')
        recipient = [email]
        send_mail(subject, message, from_email, recipient, fail_silently=False)
        print("Email OTP sent to:", email)
    else:
        # Neither mobile nor email provided
        raise ValueError("Either mobile_number or email must be provided")

    return otp