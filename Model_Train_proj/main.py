import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense

#2
# Define the paths to the train and test folders
train_path = "D:/works/Vegetable_ImagesNEW/train"
test_path = "D:/works/Vegetable_ImagesNEW/test"

# Set up the image data generators with data augmentation for the train set
train_datagen = ImageDataGenerator(
    rescale=1./255,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True
)

# Only rescale the images for the test set
#An ImageDataGenerator object is created for the training set. It performs data
# augmentation by applying various transformations to the images,
# such as rescaling their pixel values, shearing, zooming, and horizontal flipping.
test_datagen = ImageDataGenerator(rescale=1./255)

# Load the images from the folders using the data generators
train_generator = train_datagen.flow_from_directory(
    train_path,
    target_size=(64, 64),  # adjust the target size according to your needs
    batch_size=32,
    class_mode='categorical'
)

test_generator = test_datagen.flow_from_directory(
    test_path,
    target_size=(64, 64),
    batch_size=32,
    class_mode='categorical'
)



#3
# Define the CNN model
model = Sequential()
model.add(Conv2D(32, (3, 3), activation='relu', input_shape=(64, 64, 3)))
model.add(MaxPooling2D((2, 2)))
model.add(Conv2D(64, (3, 3), activation='relu'))
model.add(MaxPooling2D((2, 2)))
model.add(Conv2D(128, (3, 3), activation='relu'))
model.add(MaxPooling2D((2, 2)))
model.add(Flatten())
model.add(Dense(128, activation='relu'))
model.add(Dense(15, activation='softmax'))

# Compile the model
#Here, a Sequential model is defined, which is a linear stack of layers. Convolutional (Conv2D) and MaxPooling (MaxPooling2D)
# layers are added to extract features from the images. The Flatten layer flattens the output into a 1D vector, and Dense layers
# with ReLU activation are added for classification. The output layer has 15 units with a softmax activation function for multi-class classification.
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(
    train_generator,
    steps_per_epoch=train_generator.samples // train_generator.batch_size,
    epochs=15,
    validation_data=test_generator,
    validation_steps=test_generator.samples // test_generator.batch_size
)

#4
# Evaluate the model on the test set
loss, accuracy = model.evaluate(test_generator)
print(f"Test loss: {loss:.4f}")
print(f"Test accuracy: {accuracy:.4f}")

# Make predictions on new images
new_images_path = "D:/works/Vegetable_ImagesNEW/validation"
new_images_generator = test_datagen.flow_from_directory(
    new_images_path,
    target_size=(64, 64),
    batch_size=32,
    class_mode='categorical',
    shuffle=False
)

predictions = model.predict(new_images_generator)


# Save the model
#model.save("vegetable_modelNEW.h5")