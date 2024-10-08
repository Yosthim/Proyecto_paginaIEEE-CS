package org.ieee.paginaieee.service;

import org.ieee.paginaieee.config.SupabaseConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Objects;
import java.util.UUID;

@Service
public class ImageService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private SupabaseConfig supabaseConfig;

    private String generateUniqueFileName(String originalFilename) {
        String extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        // Crea un nombre único
        return UUID.randomUUID().toString() + extension;
    }

    public String uploadImage(MultipartFile file) throws IOException {

        String imageName = generateUniqueFileName(Objects.requireNonNull(file.getOriginalFilename()));

        String url = supabaseConfig.getSupabaseUrl() + "/storage/v1/object/" + supabaseConfig.getSupabaseBucket() + "/" + imageName;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG);
        headers.setBearerAuth(supabaseConfig.getSupabaseKey());
        HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);
        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new IOException("Unexpected code " + response.getStatusCode());
        }
        return url;
    }

    public void deleteImage(String imageName) throws IOException {

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(supabaseConfig.getSupabaseKey());
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        ResponseEntity<Void> response = restTemplate.exchange(imageName, HttpMethod.DELETE, requestEntity, Void.class);
        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new IOException("Unexpected code " + response.getStatusCode());
        }
    }

    public String replaceImage(String oldImageName, MultipartFile newFile) throws IOException {
        deleteImage(oldImageName);

        return uploadImage(newFile);
    }
}