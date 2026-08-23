import pandas as pd
from sklearn.preprocessing import OrdinalEncoder
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score
from pathlib import Path
import joblib
from sklearn.pipeline import Pipeline

this_path = Path(__file__)
backend_folder = this_path.parent
app_folder = backend_folder.parent
data_file = app_folder / "StudentPerformanceFactors.csv"
model_file = backend_folder / "student_model.pkl"

# Load the raw dataset
df = pd.read_csv(data_file)

# Remove rows containing missing values.
clean_df = df.dropna()

# Separate input features (X) from the target (y).
# Exam_Score is the target we want the model to predict.
X = clean_df.iloc[:, :-1]
y = clean_df.iloc[:, -1]

# Ordinal features have categories with a meaningful order.
ordinal_features = [
    "Parental_Involvement",
    "Access_to_Resources",
    "Motivation_Level",
    "Family_Income",
    "Teacher_Quality",
    "Peer_Influence",
    "Parental_Education_Level",
    "Distance_from_Home"
]

# Explicitly define the order of categories for each ordinal feature.
# The encoder converts them to 0, 1, 2, etc. according to this order.
ordinal_categories = [
    ["Low", "Medium", "High"],
    ["Low", "Medium", "High"],
    ["Low", "Medium", "High"],
    ["Low", "Medium", "High"],
    ["Low", "Medium", "High"],
    ["Negative", "Neutral", "Positive"],
    ["High School", "College", "Postgraduate"],
    ["Near", "Moderate", "Far"],
]

ordinal_encoder = OrdinalEncoder(categories=ordinal_categories)

# Nominal features have categories with no meaningful order.
# One-hot encoding gives each category its own binary feature.
nominal_features = [
    "Extracurricular_Activities",
    "Internet_Access",
    "School_Type",
    "Learning_Disabilities",
    "Gender"
]

nominal_encoder = OneHotEncoder(
    handle_unknown="ignore",
    sparse_output=False
)

# Identify numerical features.
numerical_features = X.select_dtypes(include="number").columns

# Apply the appropriate preprocessing to each group:
# ordinal → ordinal encoding
# nominal → one-hot encoding
# numerical → leave unchanged
preprocessor = ColumnTransformer([
    ("ordinal", ordinal_encoder, ordinal_features),
    ("nominal", nominal_encoder, nominal_features),
    ("numerical", "passthrough", numerical_features)
])

# Split the data into training and testing sets.
train_X, test_X, train_y, test_y = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Create the Linear Regression model.
linear_model = LinearRegression()

# Combine preprocessing and the model into a single Pipeline.
model_pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", linear_model)
])

# Train the Pipeline.
model_pipeline.fit(train_X, train_y)

# Evaluate the trained model.
predictions = model_pipeline.predict(test_X)
mae = mean_absolute_error(test_y, predictions)
r2 = r2_score(test_y, predictions)

print(mae, r2)

# Save the trained Pipeline for use by the backend.
joblib.dump(model_pipeline, model_file)