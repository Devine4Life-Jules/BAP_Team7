import RPi.GPIO as GPIO
import time
import uinput

BUTTON_PIN = 2  

GPIO.setmode(GPIO.BCM)
GPIO.setup(BUTTON_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)

device = uinput.Device([uinput.KEY_SPACE])

print("Ready! Press the button to output SPACE.")

try:
    while True:
        if GPIO.input(BUTTON_PIN) == GPIO.LOW:
            device.emit_click(uinput.KEY_SPACE)
            print("SPACE pressed")
            time.sleep(0.25)  # debounce
        time.sleep(0.01)
except KeyboardInterrupt:
    GPIO.cleanup()
