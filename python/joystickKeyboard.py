#!/usr/bin/env python3
import spidev
import time
from pynput.keyboard import Controller, Key
import RPi.GPIO as GPIO

# Setup keyboard controller
keyboard = Controller()

# Open SPI bus for joystick
spi = spidev.SpiDev()
spi.open(0, 0)
spi.max_speed_hz = 1350000

# Rotary encoder pins
CLK_PIN = 17  # Change these to whatever GPIO pins you want to use
DT_PIN = 18

# Setup GPIO for rotary encoder
GPIO.setmode(GPIO.BCM)
GPIO.setup(CLK_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(DT_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# Track rotary encoder state
clk_last = GPIO.input(CLK_PIN)

def read_adc(channel):
    adc = spi.xfer2([1, (8 + channel) << 4, 0])
    data = ((adc[1] & 3) << 8) + adc[2]
    return data

# Joystick channels
vrx_channel = 1  # X-axis
vry_channel = 2  # Y-axis

# Thresholds for joystick
CENTER = 512
DEADZONE = 100
THRESHOLD_LOW = CENTER - DEADZONE
THRESHOLD_HIGH = CENTER + DEADZONE

# Track previous joystick state
last_direction = None

# Keys for rotary encoder
ROTARY_LEFT_KEY = 'q'   # Change to whatever key you want for counter-clockwise
ROTARY_RIGHT_KEY = 'e'  # Change to whatever key you want for clockwise

print("Joystick + Rotary Encoder - Press CTRL+C to exit")
print("=" * 50)
print("Joystick: Arrow keys")
print(f"Rotary Left: {ROTARY_LEFT_KEY}")
print(f"Rotary Right: {ROTARY_RIGHT_KEY}")
print("=" * 50)

try:
    while True:
        # === READ ROTARY ENCODER ===
        clk_state = GPIO.input(CLK_PIN)
        dt_state = GPIO.input(DT_PIN)
        
        if clk_state != clk_last:
            if dt_state != clk_state:
                # Clockwise
                keyboard.press(ROTARY_RIGHT_KEY)
                keyboard.release(ROTARY_RIGHT_KEY)
                print(f"Rotary: Clockwise ({ROTARY_RIGHT_KEY})")
            else:
                # Counter-clockwise
                keyboard.press(ROTARY_LEFT_KEY)
                keyboard.release(ROTARY_LEFT_KEY)
                print(f"Rotary: Counter-clockwise ({ROTARY_LEFT_KEY})")
        
        clk_last = clk_state
        
        # === READ JOYSTICK ===
        x_value = read_adc(vrx_channel)
        y_value = read_adc(vry_channel)
        
        current_direction = None
        
        # Determine direction
        x_diff = abs(x_value - CENTER)
        y_diff = abs(y_value - CENTER)
        
        if x_diff > y_diff:
            if x_value < THRESHOLD_LOW:
                current_direction = Key.left
            elif x_value > THRESHOLD_HIGH:
                current_direction = Key.right
        else:
            if y_value < THRESHOLD_LOW:
                current_direction = Key.down
            elif y_value > THRESHOLD_HIGH:
                current_direction = Key.up
        
        # Only send keypress if direction changed
        if current_direction != last_direction:
            if current_direction:
                keyboard.press(current_direction)
                print(f"Joystick: {current_direction}")
                time.sleep(0.05)
                keyboard.release(current_direction)
            
            last_direction = current_direction
        
        time.sleep(0.001)  # Fast polling for rotary encoder

except KeyboardInterrupt:
    print("\n\nExiting...")
    GPIO.cleanup()
    spi.close()


