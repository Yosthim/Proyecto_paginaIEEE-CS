package org.ieee.paginaieee.repository;

import org.ieee.paginaieee.entity.Evento;
import org.ieee.paginaieee.entity.Suscripcion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SuscripcionRepository extends JpaRepository<Suscripcion, Long> {
    Optional<Suscripcion> findByCorreoAndEvento(String correo, Evento evento);
}
