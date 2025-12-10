#include <Keyboard.h>

// ----------------- ROTARY ENCODER -----------------
const int CLK = 3;  
const int DT  = 5;  

int lastCLK;

// ----------------- ANALOG JOYSTICK -----------------
#define ANALOG_X_PIN A2
#define ANALOG_Y_PIN A3
#define ANALOG_BUTTON_PIN A1

#define ANALOG_X_CORRECTION 128
#define ANALOG_Y_CORRECTION 128

// Deadzone threshold for neutral stick
#define DEADZONE 20

int lastDirX = 0;  // -1 = left, 1 = right, 0 = neutral
int lastDirY = 0;  // -1 = up,   1 = down,  0 = neutral

// ----------------- BUTTONS -----------------
const int buttonPinOk   = 4;
const int buttonPinBack = 2;

bool lastOkState = HIGH;
bool lastBackState = HIGH;


// ----------------------------------------------------
void setup() {
  pinMode(CLK, INPUT_PULLUP);
  pinMode(DT, INPUT_PULLUP);
  lastCLK = digitalRead(CLK);

  pinMode(buttonPinOk, INPUT_PULLUP);
  pinMode(buttonPinBack, INPUT_PULLUP);

  pinMode(ANALOG_BUTTON_PIN, INPUT_PULLUP);

  Keyboard.begin();
}


// ----------------------------------------------------
void loop() {

  // -------- ROTARY ENCODER --------
  int currentCLK = digitalRead(CLK);

  if (currentCLK != lastCLK) {
    if (digitalRead(DT) != currentCLK) {
      Keyboard.print("e");  // clockwise
    } else {
      Keyboard.print("a");  // counterclockwise
    }
  }
  lastCLK = currentCLK;


  // -------- ANALOG JOYSTICK as ARROW KEYS --------
  int rawX = readAnalogAxisLevel(ANALOG_X_PIN) - ANALOG_X_CORRECTION;
  int rawY = readAnalogAxisLevel(ANALOG_Y_PIN) - ANALOG_Y_CORRECTION;

  int dirX = 0;
  int dirY = 0;

  // Horizontal direction
  if (rawX > DEADZONE) dirX = 1;        // Right
  else if (rawX < -DEADZONE) dirX = -1; // Left

  // Vertical direction
  if (rawY > DEADZONE) dirY = 1;        // Down
  else if (rawY < -DEADZONE) dirY = -1; // Up

  // --- Send X movement ---
if (dirX == -1) {
  Keyboard.press(KEY_RIGHT_ARROW);
} else if (dirX == 1) {
  Keyboard.press(KEY_LEFT_ARROW);
} else {
  // Stop X movement
  Keyboard.release(KEY_RIGHT_ARROW);
  Keyboard.release(KEY_LEFT_ARROW);
}

// --- Send Y movement ---
if (dirY == 1) {
  Keyboard.press(KEY_DOWN_ARROW);
} else if (dirY == -1) {
  Keyboard.press(KEY_UP_ARROW);
} else {
  // Stop Y movement
  Keyboard.release(KEY_DOWN_ARROW);
  Keyboard.release(KEY_UP_ARROW);
}



  // -------- BUTTON OK (Space) --------
  bool currentOk = digitalRead(buttonPinOk);
  if (currentOk == LOW && lastOkState == HIGH) {
    Keyboard.write(' ');  
  } 
  lastOkState = currentOk;

  // -------- BUTTON BACK (Backspace) --------
  bool currentBack = digitalRead(buttonPinBack);
  if (currentBack == LOW && lastBackState == HIGH) {
    Keyboard.write(KEY_BACKSPACE);
  }
  lastBackState = currentBack;

  // -------- JOYSTICK BUTTON (Same as OK) --------
bool currentJoyBtn = digitalRead(ANALOG_BUTTON_PIN);
static bool lastJoyBtn = HIGH;

if (currentJoyBtn == LOW && lastJoyBtn == HIGH) {
  Keyboard.write(' ');  
}

lastJoyBtn = currentJoyBtn;

  delay(5);
}


// ----------------------------------------------------
byte readAnalogAxisLevel(int pin) {
  return map(analogRead(pin), 0, 1023, 0, 255);
}

bool isAnalogButtonPressed(int pin) {
  return digitalRead(pin) == LOW;
}
