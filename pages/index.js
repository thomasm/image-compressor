import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import {
  Box,
  Text,
  Stack,
  VStack,
  Image,
  Container,
  Button,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Spinner,
} from '@chakra-ui/react';

export default function Home() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState([]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    accept: 'image/jpeg, image/png',
    onDrop: async (acceptedFiles) => {
      const newImages = [];
    
      for (let file of acceptedFiles) {
        setLoading((prevState) => [...prevState, true]);
    
        try {
          const binaryImg = await file.arrayBuffer();
    
          const response = await axios.post('/api/upload', binaryImg, {
            headers: {
              'Content-Type': file.type,
            },
          });
          newImages.push(response.data.url);
        } catch (error) {
          console.error('Error during API call:', error.message);
          alert('An error occurred while processing the uploaded image. Please try again.');
        } finally {
          setLoading((prevState) => {
            const updatedLoadingState = [...prevState];
            updatedLoadingState.shift();
            return updatedLoadingState;
          });
        }
      }
      setImages([...images, ...newImages]);
    },
    
  });

  return (
    <VStack spacing={4} alignItems="center">
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        Drag 'n' drop JPEG and PNG files here, or click to select files
      </Alert>
      <Box
        border="2px"
        borderRadius="md"
        borderColor="gray.300"
        p={4}
        minHeight={150}
        width="100%"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Text textAlign="center">Drop your files here...</Text>
        ) : (
          <Text textAlign="center">Click or drag files here to compress</Text>
        )}
      </Box>

      <Stack direction="row" spacing={4} alignItems="center">
        {images.map((src, index) => (
          <Image key={index + loading.length} boxSize="150px" src={src} alt={`Compressed Image ${index + 1}`} />
        ))}
        {loading.map((_, index) => (
          <Box key={index} boxSize="150px" display="flex" justifyContent="center" alignItems="center">
            <Spinner />
          </Box>
        ))}
      </Stack>
    </VStack>
  );
}
