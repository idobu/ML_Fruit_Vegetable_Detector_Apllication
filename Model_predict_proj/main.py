from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np

# Load the model
model = load_model(r"D:\pycharm install\PyCharm Community Edition 2023.1.2\PROJECTS\Final_proj_smartphone\Model_ML\Model_predict_proj\vegetable_modelNEW.h5")

# Load and preprocess the new image
new_image_path = r"D:\software_matala\mobile_programming\project_final\Common_NodeJS_Express\Common_NodeJS_Express\img.jpg" #change to the image we got!
img = image.load_img(new_image_path, target_size=(64, 64))
img = image.img_to_array(img)
img = np.expand_dims(img, axis=0)
img /= 255.0

# Make a prediction on the new image
# Define the class labels
class_labels = ['apple', 'banana', 'bell pepper', 'carrot', 'corn', 'cucumber', 'lemon', 'onion', 'orange', 'pineapple','pomegranate','potato','strawberries','tomato','watermelon']


# Make a prediction on the new image
prediction = model.predict(img)

# Get the index with the highest probability
predicted_index = np.argmax(prediction)

# Get the corresponding class label
predicted_vegetable = class_labels[predicted_index]

# Print the predicted vegetable name
print(predicted_vegetable)
