-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 11 Cze 2022, 15:19
-- Wersja serwera: 10.4.16-MariaDB
-- Wersja PHP: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `saas`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `apiaries`
--

CREATE TABLE `apiaries` (
  `id` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dailyNumber` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startTime` date NOT NULL,
  `controlSum` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Zrzut danych tabeli `apiaries`
--

INSERT INTO `apiaries` (`id`, `name`, `dailyNumber`, `startTime`, `controlSum`) VALUES
('2022060900002708', 'Jeszcze Miodniejsza Barć', '00002', '2022-06-09', '708'),
('2022060900003608', 'Jakaś Super Miodna Barć', '00003', '2022-06-09', '608'),
('2022061000001728', 'Barć Braci Barciś', '00001', '2022-06-10', '728'),
('2022061000004878', 'Miód z bąka', '00004', '2022-06-10', '878'),
('2022061000005860', 'Pasieka z przesieka', '00005', '2022-06-10', '860'),
('2022061008593060', 'Wynik kręcenia Miodem', '08593', '2022-06-10', '060'),
('2022061012335730', 'Miodek Gąski Balbinki', '12335', '2022-06-10', '730'),
('2022061023843544', 'Miodna Barć', '23843', '2022-06-10', '544'),
('2022061085343380', 'Wynik kręcenia Miodem', '85343', '2022-06-10', '380'),
('2022061112363062', 'Trzetrzewińskie Trzmiele', '12363', '2022-06-11', '062');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `apiaries`
--
ALTER TABLE `apiaries`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
