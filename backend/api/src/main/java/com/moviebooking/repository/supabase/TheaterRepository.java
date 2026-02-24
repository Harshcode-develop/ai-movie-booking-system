package com.moviebooking.repository.supabase;

import com.moviebooking.entity.supabase.Theater;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TheaterRepository extends JpaRepository<Theater, String> {

    List<Theater> findByCity(String city);

    List<Theater> findByCityIgnoreCase(String city);

    List<Theater> findByNameContainingIgnoreCase(String name);
}
