package com.foundersync.post_service.repository;

import com.foundersync.post_service.entity.SavedPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SavedPostRepository extends JpaRepository<SavedPost, UUID> {

    Optional<SavedPost> findByPostIdAndUserId(UUID postId, UUID userId);

    List<SavedPost> findByUserId(UUID userId);
}