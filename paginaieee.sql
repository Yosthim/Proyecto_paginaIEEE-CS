-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema paginaieee
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema paginaieee
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `paginaieee` DEFAULT CHARACTER SET utf8 ;
USE `paginaieee` ;

-- -----------------------------------------------------
-- Table `paginaieee`.`Noticias`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `paginaieee`.`Noticias` (
  `idNoticia` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(45) NOT NULL,
  `contenido` TEXT(10000) NOT NULL,
  `autor` VARCHAR(45) NOT NULL,
  `imagen` VARCHAR(45) NOT NULL,
  `fechaPublicacion` DATE NOT NULL,
  PRIMARY KEY (`idNoticia`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `paginaieee`.`Comentarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `paginaieee`.`Comentarios` (
  `idComentario` INT NOT NULL AUTO_INCREMENT,
  `contenido` TEXT(100) NOT NULL,
  `idNoticia` INT NOT NULL,
  PRIMARY KEY (`idComentario`),
  INDEX `fk_Comentarios_Noticias_idx` (`idNoticia` ASC) VISIBLE,
  CONSTRAINT `fk_Comentarios_Noticias`
    FOREIGN KEY (`idNoticia`)
    REFERENCES `paginaieee`.`Noticias` (`idNoticia`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `paginaieee`.`Eventos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `paginaieee`.`Eventos` (
  `idEvento` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `descripcion` TEXT(200) NOT NULL,
  `fecha` DATETIME NOT NULL,
  `ubicacion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idEvento`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `paginaieee`.`Suscripciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `paginaieee`.`Suscripciones` (
  `idSuscripcion` INT NOT NULL AUTO_INCREMENT,
  `nombreUsuario` VARCHAR(45) NOT NULL,
  `correo` VARCHAR(45) NOT NULL,
  `idEvento` INT NOT NULL,
  PRIMARY KEY (`idSuscripcion`),
  INDEX `fk_Suscripciones_Eventos1_idx` (`idEvento` ASC) VISIBLE,
  CONSTRAINT `fk_Suscripciones_Eventos1`
    FOREIGN KEY (`idEvento`)
    REFERENCES `paginaieee`.`Eventos` (`idEvento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
