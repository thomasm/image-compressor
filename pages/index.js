import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import {
  Box,
  Text,
  Stack,
  VStack,
  Image,
  Button,
  Alert,
  AlertIcon,
  Spinner,
  useColorMode,
  IconButton,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";
import { FiUpload } from 'react-icons/fi';

export default function Home() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState([]);
  const { colorMode, toggleColorMode } = useColorMode();

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    accept: 'image/jpeg, image/png',
    onDrop: async (acceptedFiles) => {
      const newImages = [];
      const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
      for (let file of acceptedFiles) {
        const fileMimeType = file.type;
        if (!validMimeTypes.includes(fileMimeType)) {
          console.warn(`Invalid mime type: ${fileMimeType}`);
          continue;
        }
    
        setLoading((prevState) => [...prevState, true]);
    
        try {
          const binaryImg = await file.arrayBuffer();
    
          const response = await axios.post('/api/upload', binaryImg, {
            headers: {
              'Content-Type': fileMimeType,
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
    <Flex
      minHeight="100vh"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <Flex
        position="fixed"
        top={2}
        right={2}
        justifyContent="flex-end"
        alignItems="center"
      >
        <IconButton
          aria-label="Toggle Dark Mode"
          icon={colorMode === "dark" ? <FaSun /> : <FaMoon />}
          onClick={toggleColorMode}
        />
      </Flex>

      <Flex
        flexGrow={1}
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <VStack spacing={4} alignItems="center">
          <Heading mt={4} mb={4}>Bildeoptimalisering</Heading>
          <Text mb={4}>Effektiv JPEG og PNG komprimering for Webflow.</Text>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
          </Stack>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            border="2px"
            borderRadius="md"
            fontSize="xl"
            borderColor="gray.300"
            p={4}
            minHeight={150}
            width={300}
            cursor="grab"
            _hover={{ cursor: "grabbing" }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <FiUpload size="48"/>
            {isDragActive ? (
              <Text textAlign="center">Slipp her...</Text>
            ) : (
              <Text mt={4} textAlign="center">Dra og slipp bildene her for å komprimere</Text>
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
      </Flex>

      <Box
        as="footer"
        bg={colorMode === "dark" ? "gray.700" : "gray.300"}
        py={2}
        width="100%"
        textAlign="center"
      >
        <Text fontSize="sm" color={colorMode === "dark" ? "gray.200" : "gray.700"}>
          &copy; {new Date().getFullYear()} Peil - Denne siden er forbeholdt kunder av Peil.
        </Text>
      </Box>
    </Flex>
  );
}
