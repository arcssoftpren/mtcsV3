-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 16 Nov 2025 pada 13.43
-- Versi Server: 10.1.13-MariaDB
-- PHP Version: 5.6.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mtcsv3`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `abnormalreport_prod`
--

CREATE TABLE `abnormalreport_prod` (
  `id` int(11) NOT NULL,
  `toolId` int(11) NOT NULL,
  `findingDate` date NOT NULL,
  `userDepartment` text NOT NULL,
  `findingDescription` text NOT NULL,
  `tempActions` text,
  `reporter` int(11) NOT NULL,
  `confirmator` int(11) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `type` int(11) NOT NULL DEFAULT '1',
  `cause` text,
  `confirmationDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struktur dari tabel `headers`
--

CREATE TABLE `headers` (
  `id` int(11) NOT NULL,
  `header_key` varchar(255) NOT NULL,
  `label` varchar(255) NOT NULL,
  `objectType` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `headers`
--

INSERT INTO `headers` (`id`, `header_key`, `label`, `objectType`) VALUES
(20, 'measurementRange', 'Range of Measurement', 'text'),
(21, 'resolution', 'Resolution', 'text'),
(22, 'calibrationStandardAccuracy', 'Calibration Standard Accuracy (±)', 'text'),
(23, 'serialNo', 'Serial No.', 'text'),
(24, 'registrationDate', 'Registration Date', 'date'),
(25, 'maker', 'Maker', 'text'),
(26, 'place', 'Location', 'text'),
(27, 'calibrationInterval', 'Calibration Interval', 'text'),
(28, 'calibratedBy', 'Calibrated by', 'text'),
(29, 'lastCalibration', 'Last Calibration', 'date'),
(30, 'nextCalibration', 'Next Calibration Plan', 'date'),
(31, 'calibrationActualDate', 'Actual Date Calibration', 'date');

-- --------------------------------------------------------

--
-- Struktur dari tabel `insmethods`
--

CREATE TABLE `insmethods` (
  `methodId` int(11) NOT NULL,
  `insId` int(11) NOT NULL,
  `label` varchar(255) NOT NULL,
  `logic` int(11) NOT NULL,
  `standard` varchar(255) NOT NULL,
  `unit` varchar(8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `inspectionitems`
--

CREATE TABLE `inspectionitems` (
  `insId` int(11) NOT NULL,
  `toolId` int(11) NOT NULL,
  `label` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struktur dari tabel `inspectionresult`
--

CREATE TABLE `inspectionresult` (
  `id` bigint(20) NOT NULL,
  `methodId` int(11) NOT NULL,
  `value` varchar(255) NOT NULL,
  `inspectionId` bigint(20) NOT NULL,
  `judgement` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struktur dari tabel `inspections`
--

CREATE TABLE `inspections` (
  `id` bigint(20) NOT NULL,
  `toolId` int(11) NOT NULL,
  `inspectionDate` date NOT NULL,
  `inspector` int(11) NOT NULL,
  `judgement` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struktur dari tabel `logics`
--

CREATE TABLE `logics` (
  `id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `label` varchar(255) NOT NULL,
  `inputType` varchar(255) NOT NULL DEFAULT 'text'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `logics`
--

INSERT INTO `logics` (`id`, `description`, `label`, `inputType`) VALUES
(1, 'Options that provide OK/NG buttons for determining the inspection result.', 'OK/NG Option', 'buttonToggle'),
(2, 'Uses a range standard to determine if the input value falls within the specified minimum and maximum limits.', 'Number Range', 'number'),
(3, 'Determines the result by checking if the input value is greater than the defined minimum standard.', 'Larger Than (>)', 'number'),
(4, 'Compares the input value against a maximum threshold, and passes only if the value is below the defined limit.', 'Less Than (<)', 'number'),
(5, 'Compares the input value to a defined target with upper and lower tolerance limits. The result is OK if the input falls within the range of (target - lower) to (target + upper).', 'Upper and Lower Limit (xxx, +x, -x)', 'number'),
(6, 'Compares the input value against a minimum threshold. The result is OK if the input is greater than or equal to the specified value.', '≥ target', 'number'),
(7, 'Compares the input value against a maximum threshold. The result is OK if the input is less than or equal to the specified value.', '≤ target', 'number'),
(8, 'Performs a case-insensitive comparison between the input text and the defined standard. The result is OK if the strings match regardless of letter casing.', 'Match Text', 'text'),
(9, 'Performs a strict comparison between the input number and the expected value. The result is OK only if both values are numerically identical.', 'Match Number', 'number'),
(10, 'Checks if the input value is not equal to the specified value.', 'Not Equal', 'text'),
(16, 'Options that provide OK/NG buttons for determining the inspection result, but with custom standard text.', 'Custom OK/NG', 'buttonToggle'),
(17, 'Compares the input value to a defined target with ± tolerance limits. The result is OK if the input falls within the range of (target - lower) to (target + upper).', 'Target ± Tolerance', 'number');

-- --------------------------------------------------------

--
-- Struktur dari tabel `monthlyconfirmation`
--

CREATE TABLE `monthlyconfirmation` (
  `id` int(11) NOT NULL,
  `month` varchar(255) NOT NULL,
  `confirmator` int(11) NOT NULL,
  `confirmationDate` date NOT NULL,
  `toolId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struktur dari tabel `ranks`
--

CREATE TABLE `ranks` (
  `id` int(11) NOT NULL,
  `label` varchar(255) NOT NULL,
  `headers` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `ranks`
--

INSERT INTO `ranks` (`id`, `label`, `headers`) VALUES
(8, 'Rank A', '[19,20,21,22,23,24,25,26,27,28,29,30,31]'),
(9, 'Rank B', '[19,20,21,22,23,24,25,26,27,28,29,30,31]'),
(10, 'Rank C', '[19,20,21,22,23,24,25,26,27,28,29]');

-- --------------------------------------------------------

--
-- Struktur dari tabel `roleaccess`
--

CREATE TABLE `roleaccess` (
  `accessId` int(11) NOT NULL,
  `roleId` int(11) NOT NULL,
  `path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `roleaccess`
--

INSERT INTO `roleaccess` (`accessId`, `roleId`, `path`) VALUES
(1, 1, '/dashboard'),
(4, 3, '/dashboard'),
(5, 3, '/setups/roles'),
(6, 1, '/setups/users'),
(10, 1, '/setups/roles'),
(12, 1, '/setups/tools'),
(14, 1, '/inspections/daily'),
(15, 1, '/inspections/weekly'),
(16, 1, '/inspections/monthly'),
(17, 1, '/inspections/abnormalities'),
(18, 1, '/inspections/pdfreport'),
(19, 3, '/inspections/pdfreport'),
(20, 3, '/inspections/monthly'),
(21, 3, '/inspections/daily'),
(22, 3, '/inspections/weekly'),
(23, 3, '/inspections/abnormalities'),
(24, 3, '/setups/users'),
(25, 3, '/setups/tools');

-- --------------------------------------------------------

--
-- Struktur dari tabel `roles`
--

CREATE TABLE `roles` (
  `roleId` int(11) NOT NULL,
  `roleName` varchar(64) NOT NULL,
  `homePage` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `roles`
--

INSERT INTO `roles` (`roleId`, `roleName`, `homePage`) VALUES
(1, 'Developer', '/dashboard'),
(3, 'Administrator', '/dashboard');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tooldata`
--

CREATE TABLE `tooldata` (
  `id` int(11) NOT NULL,
  `toolId` int(11) NOT NULL,
  `headerId` int(11) NOT NULL,
  `value` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tools`
--

CREATE TABLE `tools` (
  `toolId` int(11) NOT NULL,
  `regNumber` varchar(64) NOT NULL,
  `rankId` int(11) NOT NULL,
  `toolName` varchar(64) NOT NULL,
  `type` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struktur dari tabel `types`
--

CREATE TABLE `types` (
  `id` int(11) NOT NULL,
  `label` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `types`
--

INSERT INTO `types` (`id`, `label`) VALUES
(6, 'Thickness Gauge'),
(7, 'Scale Thickness Scale Width'),
(8, 'Scale Hardness'),
(9, 'Scale Thickness'),
(10, 'Pendulum test weight'),
(11, 'Calibrator (Ruler & Convex)'),
(12, 'Specification Gravity'),
(13, 'Scale Lenght'),
(14, 'Scale dimention'),
(15, 'Scale Tensile Strength Compression Strength'),
(16, 'Scale Weight'),
(17, 'Lighting Check'),
(18, 'Scale Heat Resistance'),
(19, 'Temperature Humidity Control'),
(20, 'Thermometer');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `userNik` varchar(255) NOT NULL,
  `userPassword` varchar(255) NOT NULL,
  `roleId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`userId`, `userName`, `userNik`, `userPassword`, `roleId`) VALUES
(3, 'Adnan', 'system', '$2b$08$WK/Pmj7l2RIO8cu/OpWMd.u1ExnYhnExCqFCiLjsWI703jqj4rvla', 1),
(13, 'Admin Utama', 'admin', '$2b$10$7CmWLQ12A1EweTOzHHLIwejdXT037CE2nuigT2fb39Pi2TEBQsgEq', 3),
(14, 'test', '111', '$2b$10$J/42iJYR11TpuBJwnin4KOdf6VQAm55h592Mm/eM3B8BV7dWSHoLG', 3);

-- --------------------------------------------------------

--
-- Struktur dari tabel `weeklyconfirmation`
--

CREATE TABLE `weeklyconfirmation` (
  `id` int(11) NOT NULL,
  `dateRangeStart` date NOT NULL,
  `toolId` int(11) NOT NULL,
  `confirmator` int(11) NOT NULL,
  `confirmationDate` date NOT NULL,
  `dateRangeEnd` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `weeklyconfirmation`
--

INSERT INTO `weeklyconfirmation` (`id`, `dateRangeStart`, `toolId`, `confirmator`, `confirmationDate`, `dateRangeEnd`) VALUES
(1, '2025-11-10', 13, 3, '2025-11-15', '2025-11-16'),
(2, '2025-11-10', 12, 3, '2025-11-15', '2025-11-16'),
(3, '2025-11-10', 11, 3, '2025-11-15', '2025-11-16'),
(4, '2025-11-10', 14, 3, '2025-11-15', '2025-11-16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `abnormalreport_prod`
--
ALTER TABLE `abnormalreport_prod`
  ADD PRIMARY KEY (`id`),
  ADD KEY `toolId:` (`toolId`),
  ADD KEY `findingDate` (`findingDate`);

--
-- Indexes for table `headers`
--
ALTER TABLE `headers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `insmethods`
--
ALTER TABLE `insmethods`
  ADD PRIMARY KEY (`methodId`),
  ADD KEY `insId` (`insId`);

--
-- Indexes for table `inspectionitems`
--
ALTER TABLE `inspectionitems`
  ADD PRIMARY KEY (`insId`),
  ADD KEY `toolId` (`toolId`);

--
-- Indexes for table `inspectionresult`
--
ALTER TABLE `inspectionresult`
  ADD PRIMARY KEY (`id`),
  ADD KEY `methodId` (`methodId`),
  ADD KEY `inspectionId` (`inspectionId`);

--
-- Indexes for table `inspections`
--
ALTER TABLE `inspections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `toolId` (`toolId`);

--
-- Indexes for table `logics`
--
ALTER TABLE `logics`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `monthlyconfirmation`
--
ALTER TABLE `monthlyconfirmation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ranks`
--
ALTER TABLE `ranks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roleaccess`
--
ALTER TABLE `roleaccess`
  ADD PRIMARY KEY (`accessId`),
  ADD KEY `roleId` (`roleId`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`roleId`);

--
-- Indexes for table `tooldata`
--
ALTER TABLE `tooldata`
  ADD PRIMARY KEY (`id`),
  ADD KEY `toolId` (`toolId`);

--
-- Indexes for table `tools`
--
ALTER TABLE `tools`
  ADD PRIMARY KEY (`toolId`);

--
-- Indexes for table `types`
--
ALTER TABLE `types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD KEY `roleId` (`roleId`);

--
-- Indexes for table `weeklyconfirmation`
--
ALTER TABLE `weeklyconfirmation`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `abnormalreport_prod`
--
ALTER TABLE `abnormalreport_prod`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `headers`
--
ALTER TABLE `headers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT for table `insmethods`
--
ALTER TABLE `insmethods`
  MODIFY `methodId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `inspectionitems`
--
ALTER TABLE `inspectionitems`
  MODIFY `insId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `inspectionresult`
--
ALTER TABLE `inspectionresult`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `inspections`
--
ALTER TABLE `inspections`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `logics`
--
ALTER TABLE `logics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `monthlyconfirmation`
--
ALTER TABLE `monthlyconfirmation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `ranks`
--
ALTER TABLE `ranks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `roleaccess`
--
ALTER TABLE `roleaccess`
  MODIFY `accessId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `roleId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `tooldata`
--
ALTER TABLE `tooldata`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tools`
--
ALTER TABLE `tools`
  MODIFY `toolId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `types`
--
ALTER TABLE `types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT for table `weeklyconfirmation`
--
ALTER TABLE `weeklyconfirmation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `insmethods`
--
ALTER TABLE `insmethods`
  ADD CONSTRAINT `insmethods_ibfk_1` FOREIGN KEY (`insId`) REFERENCES `inspectionitems` (`insId`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `inspectionitems`
--
ALTER TABLE `inspectionitems`
  ADD CONSTRAINT `inspectionitems_ibfk_1` FOREIGN KEY (`toolId`) REFERENCES `tools` (`toolId`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `inspectionresult`
--
ALTER TABLE `inspectionresult`
  ADD CONSTRAINT `inspectionresult_ibfk_2` FOREIGN KEY (`methodId`) REFERENCES `insmethods` (`methodId`) ON DELETE CASCADE,
  ADD CONSTRAINT `inspectionresult_ibfk_3` FOREIGN KEY (`inspectionId`) REFERENCES `inspections` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `inspections`
--
ALTER TABLE `inspections`
  ADD CONSTRAINT `inspections_ibfk_1` FOREIGN KEY (`toolId`) REFERENCES `tools` (`toolId`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `roleaccess`
--
ALTER TABLE `roleaccess`
  ADD CONSTRAINT `roleaccess_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`roleId`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `tooldata`
--
ALTER TABLE `tooldata`
  ADD CONSTRAINT `tooldata_ibfk_1` FOREIGN KEY (`toolId`) REFERENCES `tools` (`toolId`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
