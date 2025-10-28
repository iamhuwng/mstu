import React, { useState } from 'react';
import { database } from '../services/firebase';
import { ref, push } from 'firebase/database';
import { validateQuizJson } from '../utils/validation';
import { Modal, Button, Group, FileInput } from '@mantine/core';

const UploadQuizModal = ({ show, handleClose }) => {
  const [file, setFile] = useState(null);

  const handleUpload = (e) => {
    e.preventDefault();
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          let parsedData = JSON.parse(event.target.result);
          
          // Check if the parsed data is an array of quizzes
          if (Array.isArray(parsedData)) {
            // Validate each quiz in the array
            let uploadCount = 0;
            const errors = [];
            
            for (let i = 0; i < parsedData.length; i++) {
              const quiz = parsedData[i];
              const { valid, error } = validateQuizJson(quiz);
              
              if (!valid) {
                errors.push(`Quiz ${i + 1}: ${error}`);
                continue;
              }
              
              // Set default timer for questions without one
              quiz.questions.forEach(question => {
                if (!question.timer) {
                  question.timer = 10;
                }
              });
              
              // Upload this quiz
              const quizzesRef = ref(database, 'quizzes');
              push(quizzesRef, quiz);
              uploadCount++;
            }
            
            if (errors.length > 0) {
              alert(`Uploaded ${uploadCount} quiz(es) successfully.\n\nErrors:\n${errors.join('\n')}`);
            } else {
              alert(`Successfully uploaded ${uploadCount} quiz(es)!`);
            }
            
            if (uploadCount > 0) {
              handleClose();
            }
          } else {
            // Single quiz object (original behavior)
            const { valid, error } = validateQuizJson(parsedData);

            if (!valid) {
              alert(`Invalid JSON file: ${error}`);
              return;
            }

            parsedData.questions.forEach(question => {
              if (!question.timer) {
                question.timer = 10;
              }
            });

            const quizzesRef = ref(database, 'quizzes');
            push(quizzesRef, parsedData);
            handleClose();
          }
        } catch (error) {
          console.error("Error parsing JSON file:", error);
          alert("Invalid JSON file.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Modal 
      opened={show} 
      onClose={handleClose} 
      title="Upload New Quiz"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 8
      }}
      styles={{
        content: {
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)'
        },
        header: {
          background: 'transparent',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          paddingBottom: '1rem'
        },
        title: {
          fontSize: '1.5rem',
          fontWeight: '600'
        }
      }}
    >
      <form onSubmit={handleUpload}>
        <FileInput
          label="Quiz file"
          placeholder="Select a JSON file"
          accept=".json"
          value={file}
          onChange={setFile}
          required
          styles={{
            input: {
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px'
            }
          }}
        />
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={handleClose}>Cancel</Button>
          <Button type="submit" disabled={!file}>Upload</Button>
        </Group>
      </form>
    </Modal>
  );
};

export default UploadQuizModal;