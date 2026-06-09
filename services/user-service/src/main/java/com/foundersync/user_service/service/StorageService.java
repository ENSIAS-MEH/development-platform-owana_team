package com.foundersync.user_service.service;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

    String uploadProfilePicture(MultipartFile file, String userId);

    void deleteFile(String fileUrl);
}
