import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  HStack,
  Alert,
  AlertIcon,
  Text,
  CloseButton,
  Progress,
  Stack,
} from "@chakra-ui/react";
import { AiOutlineFileAdd } from "react-icons/ai";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nhrsgicthwqsctwggxqz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ocnNnaWN0aHdxc2N0d2dneHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODkxNzMwODMsImV4cCI6MjAwNDc0OTA4M30.f1MhR4nYjFrCMjMnwjMUwlueADL8wZdPvu4MtrxPglk";

const supabase = createClient(supabaseUrl, supabaseKey);

const UploadPhotos = ({ triggerUpload, setTriggerUpload, onUploadComplete, patientId }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleUpload = async () => {
      let uploadedUrls = [];
      setUploading(true);

      for (const fileWrapper of selectedFiles) {
        const file = fileWrapper.file; // Access the file object
        const uuid = uuidv4();
        const fileExtension = file.name.split('.').pop();
        const fileName = `${uuid}.${fileExtension}`;

        const { error } = await supabase.storage
          .from('patient-records-divers')
          .upload(`patient_photos/${fileName}`, file);

        if (error) {
          toast.error(`Error uploading ${file.name}`);
        } else {
          const fileUrl = `${supabaseUrl}/storage/v1/object/public/patient-records-divers/patient_photos/${fileName}`;
          uploadedUrls.push(fileUrl);
        }
      }

      if (uploadedUrls.length > 0) {
        // Update the database after all files have been uploaded
        const { error: updateError } = await supabase
          .from('patient_records')
          .update({ file_urls: uploadedUrls })
          .eq('patient_id', patientId);

        if (updateError) {
          toast.error('Error updating database with file URLs');
        } else {
          toast.success('All files uploaded and database updated');
          onUploadComplete(uploadedUrls); // Pass the URLs back to the parent component
        }
      }

      setUploading(false);
      setSelectedFiles([]);
    };

    if (triggerUpload) {
      handleUpload();
      setTriggerUpload(false);
    }
  }, [triggerUpload, setTriggerUpload, selectedFiles, patientId, onUploadComplete]);


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).map(file => ({
      id: uuidv4(),
      file: file,
    }));
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
  };

  const handleFileDelete = (fileId) => {
    setSelectedFiles(selectedFiles.filter(file => file.id !== fileId));
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Box p={5} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <VStack spacing={4}>
        <FormControl id="file-upload">
          <FormLabel>Charger des Photos (JPEG, PNG, PDF)</FormLabel>
          <Stack direction="row" align="center">
            <Button leftIcon={<AiOutlineFileAdd />} colorScheme="blue" onClick={handleClick}>
              Choisir un ou des fichier(s) ou prendre une photo
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".jpeg, .jpg, .png, .pdf"
              hidden // Hide the default input
            />
          </Stack>
        </FormControl>

        {selectedFiles.map(({ id, file }) => (
          <HStack key={id} w="full" justify="space-between" p={2} borderWidth="1px" borderRadius="md">
            <Text>{file.name}</Text>
            <Button colorScheme="red" size="sm" onClick={() => handleFileDelete(id)}>Supprimer</Button>
          </HStack>
        ))}

        {uploading && (
          <Alert status="info" variant="left-accent">
            <AlertIcon />
            Chargement du fichier...
            <Progress size="xs" isIndeterminate mt={2} />
          </Alert>
        )}

        {toast.isActive() && (
          <Alert status="success" variant="left-accent">
            <AlertIcon />
            {toast.message}
            <CloseButton position="absolute" right="8px" top="8px" />
          </Alert>
        )}
      </VStack>
    </Box>
  );
};

export default UploadPhotos;

