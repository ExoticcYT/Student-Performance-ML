import pandas as pd
from sklearn.preprocessing import OrdinalEncoder
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor

# Load the raw dataset
df = pd.read_csv("StudentPerformanceFactors.csv")

# Initial exploration
# print(df.head())
# print(df.shape)
# print(df.info())
# print(df.isnull().sum())

# Remove rows containing missing values.
# The original df is kept unchanged as a backup.
clean_df = df.dropna()

# Verify the cleaned dataset
# print(clean_df.shape)
# print(clean_df.isnull().sum())
# print(clean_df.columns)
# print(clean_df.dtypes)

# Explore the unique categories in categorical columns
# for col in clean_df.select_dtypes(include="object").columns:
#     print(col, clean_df[col].unique())

# Separate input features (X) from the target (y).
# Exam_Score is the target we want the model to predict.
X = clean_df.iloc[:, :-1]
y = clean_df.iloc[:, -1]

# Identify categorical features
# "object" is commonly used by pandas for text/categorical data.
# categorical_features = clean_df.select_dtypes(include="object").columns

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
# The encoder will convert them to 0, 1, 2, etc. according to this order.
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

# Test ordinal encoding manually
# X_ordinal = ordinal_encoder.fit_transform(X[ordinal_features])
# print(X_ordinal[:5])

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

# Test nominal encoding manually
# X_nominal = nominal_encoder.fit_transform(X[nominal_features])
# print(X_nominal[:5])
# print(X_nominal.shape)

# Identify numerical features.
# "number" includes numeric types such as int64 and float64.
numerical_features = X.select_dtypes(include="number").columns

# print(len(numerical_features))

# Apply the appropriate preprocessing to each group:
# ordinal → ordinal encoding
# nominal → one-hot encoding
# numerical → leave unchanged
preprocessor = ColumnTransformer([
    ("ordinal", ordinal_encoder, ordinal_features),
    ("nominal", nominal_encoder, nominal_features),
    ("numerical", "passthrough", numerical_features)
])

# Transform all features into numerical form.
# We'll later move this operation AFTER the train/test split
# # to prevent data leakage.
# X_processed = preprocessor.fit_transform(X)
# print(X_processed.shape)

train_X, test_X, train_y, test_y = train_test_split(X, y, test_size=0.2, random_state=42)

processed_train_X = preprocessor.fit_transform(train_X)
processed_test_X = preprocessor.transform(test_X)

# print(train_X.shape)
# print(test_X.shape)
# print(train_y.shape)
# print(test_y.shape)

# I COMPARED THE 3. LINEAR REGRESSION IS THE CLEAR WINNER

linear_model = LinearRegression()
linear_model.fit(processed_train_X, train_y)
linear_predictions = linear_model.predict(processed_test_X)
linear_MAE = mean_absolute_error(test_y, linear_predictions)
print(linear_MAE)
linear_r2 = r2_score(test_y, linear_predictions)
print(linear_r2)

# print(linear_model.coef_)
# print(preprocessor.get_feature_names_out())

coefficients = pd.Series(linear_model.coef_, index=preprocessor.get_feature_names_out())

print(coefficients.sort_values(key=abs))

# tree_model = DecisionTreeRegressor(max_depth = 6, random_state=42)
# tree_model.fit(processed_train_X, train_y)
# tree_preds = tree_model.predict(processed_test_X)
# tree_MAE = mean_absolute_error(test_y, tree_preds)
# print(tree_MAE)
# tree_r2 = r2_score(test_y, tree_preds)
# print(tree_r2)

# forest_model = RandomForestRegressor(n_estimators=1000, random_state=42, max_depth=30, min_samples_leaf=5)
# forest_model.fit(processed_train_X, train_y)
# forest_preds = forest_model.predict(processed_test_X)
# forest_MAE = mean_absolute_error(test_y, forest_preds)
# print(forest_MAE)
# forest_r2 = r2_score(test_y, forest_preds)
# print(forest_r2)