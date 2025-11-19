#!/usr/bin/env python3
import spidev
import time
from pynput.keyboard import Controller, Key

# Setup keyboard controller
keyboard = Controller()

# Open SPI bus
spi = spidev.SpiDev()
spi.open(0, 0)
spi.max_speed_hz = 1350000

def read_adc(channel):
    adc = spi.xfer2([1, (8 + channel) << 4, 0])
    data = ((adc[1] & 3) << 8) + adc[2]
    return data

# Joystick channels
vrx_channel = 1  # X-axis
vry_channel = 2  # Y-axis

# Thresholds for detecting movement
CENTER = 512
DEADZONE = 100  # Ignore small movements near center
THRESHOLD_LOW = CENTER - DEADZONE
THRESHOLD_HIGH = CENTER + DEADZONE

# Track previous state to avoid repeated presses
last_direction = None

print("Joystick to Arrow Keys - Press CTRL+C to exit")
print("Move joystick to simulate arrow keys")
print("=" * 50)

try:
    while True:
        # Read joystick values
        x_value = read_adc(vrx_channel)
        y_value = read_adc(vry_channel)
        
        current_direction = None
        
        # Determine direction (prioritize stronger movement)
        x_diff = abs(x_value - CENTER)
        y_diff = abs(y_value - CENTER)
        
        if x_diff > y_diff:
            # Horizontal movement is stronger
            if x_value < THRESHOLD_LOW:
                current_direction = Key.left
            elif x_value > THRESHOLD_HIGH:
                current_direction = Key.right
        else:
            # Vertical movement is stronger
            if y_value < THRESHOLD_LOW:
                current_direction = Key.down
            elif y_value > THRESHOLD_HIGH:
                current_direction = Key.up
        
        # Only send keypress if direction changed
        if current_direction != last_direction:
            if current_direction:
                keyboard.press(current_direction)
                print(f"Pressed: {current_direction}")
                time.sleep(0.05)  # Short press
                keyboard.release(current_direction)
            
            last_direction = current_direction
        
        time.sleep(0.05)  # Poll rate

except KeyboardInterrupt:
    print("\n\nExiting...")
    spi.close()