"use client";
 
import { useState, useEffect } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Typography,
  Box,
  Button,
  IconButton,
  Card,
  CardContent,
  Select,
  MenuItem,
  CircularProgress,
  Checkbox,
  TextField
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
 
interface QuizQuestionProps {
  questionNumber?: number;
  question?: string;
  onSubmit?: (answer: string) => void;
}

// Timer Component
function TimerWithCircularProgress({
  totalTimeInSeconds = 300,
  onTimeUp,
}: {
  totalTimeInSeconds?: number;
  onTimeUp: () => void;
}) {
  const [remainingTime, setRemainingTime] = useState(totalTimeInSeconds);
  const [progress, setProgress] = useState(100);
 
  useEffect(() => {
    if (remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
 
      return () => clearInterval(interval);
    } else {
      onTimeUp();
    }
  }, [remainingTime, onTimeUp]);
 
  useEffect(() => {
    setProgress((remainingTime / totalTimeInSeconds) * 100);
  }, [remainingTime, totalTimeInSeconds]);
 
  return (
    <Card sx={{ mb: 2, minHeight: "150px" }}>
      <CardContent>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress
            variant="determinate"
            value={progress}
            size={80}
            thickness={4}
          />
          <Typography
            variant="caption"
            component="div"
            color="text.secondary"
            sx={{
              position: "absolute",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            {Math.floor(remainingTime / 60)}:{("0" + (remainingTime % 60)).slice(
              -2
            )}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
 
export default function QuizQuestion({
  questionNumber,
  question,
  onSubmit,
}: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [showProgress, setShowProgress] = useState(false);
  const [showAnswerDetails, setShowAnswerDetails] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<{[key: number]: string}>({});
  const value2 = 50;
 
  const questions = [
    {
      id: 1,
      text: "What is React?",
      type: "mcq", // Single choice question
      options: [
        "A JavaScript library",
        "A programming language",
        "A database",
        "A web server",
      ],
    },
    {
      id: 2,
      text: "TypeScript is a superset of which language?",
      type: "mcq",
      options: ["Python", "JavaScript", "C++", "Java"],
    },
    {
      id: 3,
      text: "Select all frontend frameworks you know:",
      type: "mrq", // Multiple response question
      options: ["React", "Vue", "Laravel", "Angular"],
    },
    {
      id: 4,
      text: "Is JavaScript a statically typed language?",
      type: "yes_no", // Yes/No question
      options: ["Yes", "No"],
    },
    {
      id: 5,
      text: "What is 2 + 2?",
      type: "numeric", // Numeric answer
    },
  ];
  
 
  const handleSubmit = () => {
    if (currentQuestionData.type === "mrq" && selectedAnswer.length === 0) {
      alert("Please select at least one option.");
      return;
    }
  
    if (currentQuestionData.type !== "mrq" && !selectedAnswer) {
      alert("Please select an answer.");
      return;
    }
  
    // Save the selected answer
    setAnsweredQuestions((prev) => ({
      ...prev,
      [currentQuestion]: selectedAnswer.join(", "),
    }));
  
    setSelectedAnswer(currentQuestionData.type === "mrq" ? [] : []); // Clear selection for next question
  
    // Move to the next question or finish the quiz
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowProgress(true);
    }
  };
  

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
 
  const handleTimeUp = () => {
    alert("Time's up!");
  };
 
  const currentQuestionData = questions[currentQuestion - 1];
 
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
        p: 2,
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Main Question Card */}
      <Box sx={{ flex: { xs: 1, md: 3 } }}>
        <Card>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" component="div">
                Question {currentQuestion}
              </Typography>
              <IconButton color="warning">
                <BookmarkIcon />
              </IconButton>
            </Box>
 
            <Typography variant="body1" sx={{ mb: 3 }}>
              {currentQuestionData.text}
            </Typography>
 
            <FormControl component="fieldset">
            {currentQuestionData.type === "mcq" && (
  <RadioGroup
  value={selectedAnswer}
  onChange={(e) => setSelectedAnswer([e.target.value])}
>
  {currentQuestionData.options?.map((option, index) => (
    <FormControlLabel
      key={index}
      value={option}
      control={<Radio />}
      label={option}
    />
  ))}
</RadioGroup>
)}

{currentQuestionData.type === "mrq" && (
  <Box>
    {currentQuestionData.options?.map((option, index) => (
      <FormControlLabel
        key={index}
        control={
          <Checkbox
            checked={selectedAnswer.includes(option)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedAnswer((prev) => [...prev, option]);
              } else {
                setSelectedAnswer((prev) =>
                  prev.filter((ans) => ans !== option)
                );
              }
            }}
          />
        }
        label={option}
      />
    ))}
  </Box>
)}

{currentQuestionData.type === "yes_no" && (
  <RadioGroup
    value={selectedAnswer}
    onChange={(e) => setSelectedAnswer([e.target.value])}
  >
    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
    <FormControlLabel value="No" control={<Radio />} label="No" />
  </RadioGroup>
)}

  {currentQuestionData.type === "numeric" && (
    <TextField
    type="number"
    value={selectedAnswer}
    onChange={(e) => setSelectedAnswer([e.target.value])}
    label="Your Answer"
    fullWidth
  />
  )}
</FormControl>



          </CardContent>
        </Card>
        <Box sx={{ mt: 2, justifyContent: "flex-end", display: "flex", gap: 2 }}>
          {currentQuestion > 1 && (
            <Button
              variant="contained"
              onClick={handlePrevious}
              sx={{ width: "80px" }}
            >
              Previous
            </Button>
          )}
         <Button
  variant="contained"
  onClick={handleSubmit}
  sx={{ width: "80px" }}
>
  {currentQuestion === questions.length ? "Finish" : "Next"}
</Button>

        </Box>
        {showProgress && (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={value2}
                  size={80}
                  thickness={6}
                  sx={{
                    color: "#001e3c",
                  }}
                />
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                  sx={{
                    position: "absolute",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {value2}%
                </Typography>
              </Box>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  color="secondary"
                  onClick={() => setShowAnswerDetails(!showAnswerDetails)}
                >
                  View Answer
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
        {showAnswerDetails && (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quiz Summary
              </Typography>
              {questions.map((q) => (
                <Box key={q.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Question {q.id}: {q.text}
                  </Typography>
                  <Typography color={answeredQuestions[q.id] ? "success.main" : "error.main"}>
                    Status: {answeredQuestions[q.id] ? "Answered" : "Unanswered"}
                  </Typography>
                  {answeredQuestions[q.id] && (
                    <Typography color="text.secondary">
                      Your Answer: {answeredQuestions[q.id]}
                    </Typography>
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        )}
      </Box>
      {/* Sidebar */}
      <Box
        sx={{ flex: { xs: 1, md: 1 }, maxWidth: { xs: "100%", md: "250px" } }}
      >
        {/* Timer */}
        <TimerWithCircularProgress
          totalTimeInSeconds={300}
          onTimeUp={handleTimeUp}
        />
 
        {/* Filter */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
              Filter
            </Typography>
            <FormControl fullWidth>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                size="small"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Answered">Answered</MenuItem>
                <MenuItem value="Unanswered">Unanswered</MenuItem>
                <MenuItem value="Marked">Marked for Review</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>
 
        {/* Questions Status */}
        <Card>
          <CardContent>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
              Quiz Question
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "success.main",
                  }}
                />
                <Typography>Answered: {Object.keys(answeredQuestions).length}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "info.main",
                  }}
                />
                <Typography>Unanswered: {questions.length - Object.keys(answeredQuestions).length}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "warning.main",
                  }}
                />
                <Typography>Marked For Review: 0</Typography>
              </Box>
            </Box>
 
            {/* Question Number Buttons */}
            <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {questions.map((q) => (
                <Button
                  key={q.id}
                  variant="outlined"
                  size="small"
                  sx={{
                    minWidth: "36px",
                    height: "36px",
                    p: 0,
                    position: "relative",
                    backgroundColor:
                      currentQuestion === q.id ? "primary.light" : answeredQuestions[q.id] ? "success.light" : "inherit",
                    flexBasis: "calc(20% - 8px)",
                  }}
                  onClick={() => setCurrentQuestion(q.id)}
                >
                  {q.id}
                </Button>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}