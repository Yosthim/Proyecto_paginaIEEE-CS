package org.ieee.paginaieee.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.ieee.paginaieee.entity.Evento;

public interface EventoRepository extends JpaRepository<Evento,Long> {
}
