import RPi.GPIO as GPIO
import time
import uinput

BUTTON_PIN = 2

GPIO.setmode(GPIO.BCM)
GPIO.setup(BUTTON_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)