#!/usr/bin/env python3
import RPi.GPIO as GPIO
import spidev
import time
import uinput

# Setup SPI for joystick
spi = spidev.SpiDev()
spi.open(0, 0)
spi.max_speed_hz = 1350000

# Rotary encoder pins
CLK_PIN = 17
DT_PIN = 18

# Setup GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(CLK_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(DT_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)

clk_last = GPIO.input(CLK_PIN)

# Setup uinput virtual keyboard
device = uinput.Device([
    uinput.KEY_UP,
    uinput.KEY_DOWN,
    uinput.KEY_LEFT,
    uinput.KEY_RIGHT,
    uinput.KEY_Q,  # Rotary left
    uinput.KEY_E   # Rotary right
])

def read_adc(channel):
    adc = spi.xfer2([1, (8 + channel) << 4, 0])
    data = ((adc[1] & 3) << 8) + adc[2]
    return data

# Joystick settings
vrx_channel = 1
vry_channel = 2
CENTER = 512
DEADZONE = 100
THRESHOLD_LOW = CENTER - DEADZONE
THRESHOLD_HIGH = CENTER + DEADZONE

last_direction = None

print("Joystick + Rotary Encoder Ready!")
print("=" * 50)

try:
    while True:
        # === ROTARY ENCODER ===
        clk_state = GPIO.input(CLK_PIN)
        dt_state = GPIO.input(DT_PIN)
        
        if clk_state != clk_last:
            if dt_state != clk_state:
                device.emit_click(uinput.KEY_E)
                print("Rotary: Right (E)")
            else:
                device.emit_click(uinput.KEY_Q)
                print("Rotary: Left (Q)")
        
        clk_last = clk_state
        
        # === JOYSTICK ===
        x_value = read_adc(vrx_channel)
        y_value = read_adc(vry_channel)
        
        current_direction = None
        x_diff = abs(x_value - CENTER)
        y_diff = abs(y_value - CENTER)
        
        if x_diff > y_diff:
            if x_value < THRESHOLD_LOW:
                current_direction = uinput.KEY_LEFT
            elif x_value > THRESHOLD_HIGH:
                current_direction = uinput.KEY_RIGHT
        else:
            if y_value < THRESHOLD_LOW:
                current_direction = uinput.KEY_DOWN
            elif y_value > THRESHOLD_HIGH:
                current_direction = uinput.KEY_UP
        
        if current_direction != last_direction:
            if current_direction:
                device.emit_click(current_direction)
                key_name = {
                    uinput.KEY_UP: "UP",
                    uinput.KEY_DOWN: "DOWN",
                    uinput.KEY_LEFT: "LEFT",
                    uinput.KEY_RIGHT: "RIGHT"
                }.get(current_direction, "")
                print(f"Joystick: {key_name}")
            
            last_direction = current_direction
        
        time.sleep(0.01)

except KeyboardInterrupt:
    print("\nExiting...")
    GPIO.cleanup()
    spi.close()