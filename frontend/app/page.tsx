"use client";

import {useState} from "react";

function Dropdown({ label_name, dropdown_elements, value, onChange }: {
  label_name: string;
  dropdown_elements: string[];
  value: string;
  onChange: (value: string) => void;
}){
  return(
    <div className="mt-6">
      <label className="block text-lg font-medium">
        {label_name}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg bg-zinc-800 p-3 text-lg"
      >
        {dropdown_elements.map((element) => (
          <option value={element} key={element}>
            {element}
          </option>
        ))}
      </select>
    </div>
  );
}

function NumInput({ label_name, placeholder, value, onChange }:{
  label_name: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}){
  return(
    <div className="mt-6">
      <label className="block text-lg font-medium">
        {label_name}
      </label>
      <input 
        type="number" 
        placeholder={placeholder} 
        value = {value}
        onChange = {(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg bg-zinc-800 p-3 text-lg"
      />
    </div>
  );
}

export default function Home() {
  const [hoursStudied, setHoursStudied] = useState("");
  const [attendancePercentage, setAttendancePercentage] = useState("");
  const [avgSleep, setAvgSleep] = useState("");
  const [avgScores, setAvgScores] = useState("");
  const [tutoringSeshes, setTutoringSeshes] = useState("");
  const [avgPE, setAvgPE] = useState("");

  const [parentalInvolvement, setParentalInvolvement] = useState("");
  const [accessToResources, setAccessToResources] = useState("");
  const [motivationLevel, setMotivationLevel] = useState("");
  const [familyIncome, setFamilyIncome] = useState("");
  const [teacherQuality, setTeacherQuality] = useState("");
  const [peerInfluence, setPeerInfluence] = useState("");
  const [parentEducationLevel, setParentEducationLevel] = useState("");
  const [distanceFromHome, setDistanceFromHome] = useState("");
  const [extracurricularActivities, setExtracurricularActivities] = useState("");
  const [internetAccess, setInternetAccess] = useState("");
  const [schoolType, setSchoolType] = useState("");
  const [learningDisabilities, setLearningDisabilities] = useState("");
  const [gender, setGender] = useState("");

  const predictionData = {
    Hours_Studied: hoursStudied,
    Attendance: attendancePercentage,
    Sleep_Hours: avgSleep,
    Previous_Scores: avgScores,
    Tutoring_Sessions: tutoringSeshes,
    Physical_Activity: avgPE,
  
    Parental_Involvement: parentalInvolvement,
    Access_to_Resources: accessToResources,
    Motivation_Level: motivationLevel,
    Family_Income: familyIncome,
    Teacher_Quality: teacherQuality,
    Peer_Influence: peerInfluence,
    Parental_Education_Level: parentEducationLevel,
    Distance_from_Home: distanceFromHome,
    Extracurricular_Activities: extracurricularActivities,
    Internet_Access: internetAccess,
    School_Type: schoolType,
    Learning_Disabilities: learningDisabilities,
    Gender: gender
  };

  const getPrediction = async() => {
    const response = await fetch("https://localhost:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type":"application/json",
      },
      body: JSON.stringify(predictionData),
    });

    const data = await response.json();
  };

  return (
  <main className="min-h-screen bg-zinc-950 text-white p-10">
    <div className="max-w-8xl mx-auto">
      <h1 className="text-5xl font-bold">
        Student Performance AI
      </h1>

      <p className="mt-2 text-zinc-400 text-lg">
        Predict your exam score and get personalized study advice.
      </p>

      <section className="mt-8 rounded-2xl bg-zinc-900 p-6 pb-12">
        <h2 className="text-3xl font-semibold">
          Student Profile
        </h2>

        <div className="grid grid-cols-4 gap-6 mt-6">
          <Dropdown
            label_name="Parental Involvement"
            dropdown_elements={["Low", "Medium", "High"]}
            value={parentalInvolvement}
            onChange={setParentalInvolvement}
          />
            
          <Dropdown
            label_name="Access to Resources"
            dropdown_elements={["Low", "Medium", "High"]}
            value={accessToResources}
            onChange={setAccessToResources}
          />
            
          <Dropdown
            label_name="Motivation Level"
            dropdown_elements={["Low", "Medium", "High"]}
            value={motivationLevel}
            onChange={setMotivationLevel}
          />
            
          <Dropdown
            label_name="Family Income"
            dropdown_elements={["Low", "Medium", "High"]}
            value={familyIncome}
            onChange={setFamilyIncome}
          />
            
          <Dropdown
            label_name="Teacher Quality"
            dropdown_elements={["Low", "Medium", "High"]}
            value={teacherQuality}
            onChange={setTeacherQuality}
          />
            
          <Dropdown
            label_name="Peer Influence"
            dropdown_elements={["Negative", "Neutral", "Positive"]}
            value={peerInfluence}
            onChange={setPeerInfluence}
          />
            
          <Dropdown
            label_name="Parent Education Level"
            dropdown_elements={["High School", "College", "Postgraduate"]}
            value={parentEducationLevel}
            onChange={setParentEducationLevel}
          />
            
          <Dropdown
            label_name="Distance from Home"
            dropdown_elements={["Near", "Moderate", "Far"]}
            value={distanceFromHome}
            onChange={setDistanceFromHome}
          />
            
          <Dropdown
            label_name="Extracurricular Activities"
            dropdown_elements={["Yes", "No"]}
            value={extracurricularActivities}
            onChange={setExtracurricularActivities}
          />
            
          <Dropdown
            label_name="Internet Access"
            dropdown_elements={["Yes", "No"]}
            value={internetAccess}
            onChange={setInternetAccess}
          />
            
          <Dropdown
            label_name="School Type"
            dropdown_elements={["Public", "Private"]}
            value={schoolType}
            onChange={setSchoolType}
          />
            
          <Dropdown
            label_name="Learning Disabilities"
            dropdown_elements={["Yes", "No"]}
            value={learningDisabilities}
            onChange={setLearningDisabilities}
          />
            
          <Dropdown
            label_name="Gender"
            dropdown_elements={["Male", "Female"]}
            value={gender}
            onChange={setGender}
          />
        </div>

      </section>
      <section className="mt-8 rounded-2xl bg-zinc-900 p-6 pb-12">
        <h2 className="text-3xl font-semibold">
          Student Metrics
        </h2>

        <div className="grid grid-cols-3 gap-6 mt-6">
          <NumInput 
            label_name="Hours Studied" 
            placeholder="Enter number of hours you study per week on average" 
            value={hoursStudied}
            onChange={setHoursStudied}
          />
          <NumInput 
            label_name="Attendance" 
            placeholder="Enter your average attendance % (0-100)"
            value={attendancePercentage}
            onChange={setAttendancePercentage}
          />
          <NumInput 
            label_name="Sleep Hours" 
            placeholder="Enter average sleeping hours at night"
            value={avgSleep}
            onChange={setAvgSleep}
          />
          <NumInput 
            label_name="Previous Scores" 
            placeholder="Enter avg previous exams score (N/A? enter any value 0-100)"
            value={avgScores}
            onChange={setAvgScores}
          />
          <NumInput 
            label_name="Tutoring Sessions" 
            placeholder="Enter # of times you saw a tutor for this test?"
            value={tutoringSeshes}
            onChange={setTutoringSeshes}
          />
          <NumInput 
            label_name="Physical Activity" 
            placeholder="Enter average physical activity hours per week"
            value={avgPE}
            onChange={setAvgPE}
          />
        </div>
      </section>
      <section>
        <button onClick={getPrediction}>
          Predict
        </button>
      </section>
    </div>
  </main>
  );
}