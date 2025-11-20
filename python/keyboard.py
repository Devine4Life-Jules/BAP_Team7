import RPi.GPIO as GPIO
import time
import uinput

SPACE_BUTTON= 2
BACKSPACE_BUTTON= 3

GPIO.setmode(GPIO.BCM)
GPIO.setup(SPACE_BUTTON, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(BACKSPACE_BUTTON, GPIO.IN, pull_up_down=GPIO.PUD_UP)

device = uinput.Device([uinput.KEY_SPACE, uinput.KEY_BACKSPACE ])

print("Ready! Press the button to output SPACE.")

try:
    while True:
        if GPIO.input(SPACE_BUTTON) == GPIO.LOW:
            device.emit_click(uinput.KEY_SPACE)
            print("SPACE pressed")
            time.sleep(0.25)  

        if GPIO.input(BACKSPACE_BUTTON) == GPIO.LOW:
            device.emit_click(uinput.KEY_BACKSPACE)
            print("BACKSPACE pressed") 
            time.sleep(0.25)  


        time.sleep(0.01)
except KeyboardInterrupt:
    GPIO.cleanup()   
