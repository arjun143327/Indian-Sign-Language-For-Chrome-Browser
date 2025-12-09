import cv2
import numpy as np
import os
import mediapipe as mp

# --- CONFIGURATION ---
# We look for folders inside 'Raw_Data'
base_dir = os.path.dirname(os.path.abspath(__file__))
RAW_DATA_PATH = os.path.join(base_dir, "Raw_Data") 
EXPORT_PATH = os.path.join(base_dir, "MP_Data")

# These must match exactly the folder names you put in Raw_Data
ACTIONS = np.array(['Hello', 'Thanks', 'Yes', 'No', 'Help']) 
SEQUENCE_LENGTH = 30 # We take 30 frames per video

# --- MEDIAPIPE SETUP ---
mp_holistic = mp.solutions.holistic

def mediapipe_detection(image, model):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) 
    image.flags.writeable = False                  
    results = model.process(image)                 
    image.flags.writeable = True                   
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR) 
    return image, results

def extract_keypoints(results):
    pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33*4)
    lh = np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]).flatten() if results.left_hand_landmarks else np.zeros(21*3)
    rh = np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]).flatten() if results.right_hand_landmarks else np.zeros(21*3)
    return np.concatenate([pose, lh, rh])

# --- MAIN LOOP ---
def run_processing():
    with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
        
        # Loop through each word (Hello, Thanks, etc.)
        for action in ACTIONS:
            action_path = os.path.join(RAW_DATA_PATH, action)
            
            if not os.path.exists(action_path):
                print(f"⚠️ Warning: Folder not found for '{action}'. Skipping...")
                continue

            # Create output folder
            try: 
                os.makedirs(os.path.join(EXPORT_PATH, action))
            except: pass
            
            print(f"--- Processing: {action} ---")
            
            video_files = [f for f in os.listdir(action_path) if f.endswith(('.mp4', '.avi', '.mov'))]
            
            for video_idx, video_file in enumerate(video_files):
                video_path = os.path.join(action_path, video_file)
                cap = cv2.VideoCapture(video_path)
                
                # Create a folder for this specific video's frames
                save_path = os.path.join(EXPORT_PATH, action, str(video_idx))
                try: os.makedirs(save_path); except: pass

                frame_num = 0
                while cap.isOpened() and frame_num < SEQUENCE_LENGTH:
                    ret, frame = cap.read()
                    if not ret: break
                    
                    # 1. Detect Landmarks
                    image, results = mediapipe_detection(frame, holistic)
                    
                    # 2. Extract Numbers
                    keypoints = extract_keypoints(results)
                    
                    # 3. Save to file
                    npy_path = os.path.join(save_path, str(frame_num))
                    np.save(npy_path, keypoints)
                    
                    frame_num += 1
                
                cap.release()
                print(f"   Processed Video {video_idx+1}/{len(video_files)}")

if __name__ == "__main__":
    run_processing()