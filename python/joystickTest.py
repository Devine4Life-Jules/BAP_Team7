#!/usr/bin/env python3
import spidev
import time

# Open SPI bus
spi = spidev.SpiDev()
spi.open(0, 0)
spi.max_speed_hz = 1350000

# Function to read SPI data from MCP3008 chip
# Channel must be an integer 0-7
def read_adc(channel):
    if channel < 0 or channel > 7:
        return -1
    
    # Perform SPI transaction and store returned bits in 'adc'
    adc = spi.xfer2([1, (8 + channel) << 4, 0])
    
    # Extract data from the returned bits
    data = ((adc[1] & 3) << 8) + adc[2]
    return data

# Define which channels your joystick is connected to
# Based on the diagram:
vrx_channel = 1  # CH1 = X-axis (blue wire)
vry_channel = 2  # CH2 = Y-axis (green wire from joystick)
sw_channel = 0   # CH0 = Switch (purple wire)

print("Joystick Test - Press CTRL+C to exit")
print("=" * 50)

try:
    while True:
        # Read the joystick position data
        x_value = read_adc(vrx_channel)
        y_value = read_adc(vry_channel)
        switch_value = read_adc(sw_channel)
        
        # Display results
        print(f"X: {x_value:4d}  |  Y: {y_value:4d}  |  Switch: {switch_value:4d}", end='\r')
        
        # Small delay
        time.sleep(0.1)

except KeyboardInterrupt:
    print("\n\nExiting...")
    spi.close()