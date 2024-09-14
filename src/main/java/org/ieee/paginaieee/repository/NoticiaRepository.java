package org.ieee.paginaieee.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ieee.paginaieee.entity.Noticia;

public interface NoticiaRepository extends JpaRepository<Noticia, Long> {
}
