"use client";

import {useState} from "react";

function Dropdown({ label_name, dropdown_elements }: {
  label_name: string;
  dropdown_elements: string[];
}){
  return(
    <div className="mt-6">
      <label className="block text-lg font-medium">
        {label_name}
      </label>

      <select className="mt-2 w-full rounded-lg bg-zinc-800 p-3 text-lg">
        {dropdown_elements.map((element) => (
          <option value={element} key={element}>{element}</option>
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
          />
          
          <Dropdown
            label_name="Access to Resources"
            dropdown_elements={["Low", "Medium", "High"]}
          />

          <Dropdown
            label_name="Motivation Level"
            dropdown_elements={["Low", "Medium", "High"]}
          />

          <Dropdown
            label_name="Family Income"
            dropdown_elements={["Low", "Medium", "High"]}
          />

          <Dropdown
            label_name="Teacher Quality"
            dropdown_elements={["Low", "Medium", "High"]}
          />

          <Dropdown
            label_name="Peer Influence"
            dropdown_elements={["Negative", "Neutral", "Positive"]}
          />

          <Dropdown
            label_name="Parent Education Level"
            dropdown_elements={["High School", "College", "Postgraduate"]}
          />

          <Dropdown
            label_name="Distance from Home"
            dropdown_elements={["Near", "Moderate", "Far"]}
          />

          <Dropdown
            label_name="Extracurricular Activities"
            dropdown_elements={["Yes", "No"]}
          />
            
          <Dropdown
            label_name="Internet Access"
            dropdown_elements={["Yes", "No"]}
          />
            
          <Dropdown
            label_name="School Type"
            dropdown_elements={["Public", "Private"]}
          />
            
          <Dropdown
            label_name="Learning Disabilities"
            dropdown_elements={["Yes", "No"]}
          />
            
          <Dropdown
            label_name="Gender"
            dropdown_elements={["Male", "Female"]}
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
    </div>
  </main>
  );
}