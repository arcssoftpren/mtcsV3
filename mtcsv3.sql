-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 17 Nov 2025 pada 02.00
-- Versi Server: 10.1.13-MariaDB
-- PHP Version: 5.6.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!40101 SET NAMES utf8mb4 */
;

--
-- Database: `mtcs`
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
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

-- --------------------------------------------------------

--
-- Struktur dari tabel `headers`
--

CREATE TABLE `headers` (
    `id` int(11) NOT NULL,
    `header_key` varchar(255) NOT NULL,
    `label` varchar(255) NOT NULL,
    `objectType` varchar(255) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

--
-- Dumping data untuk tabel `headers`
--

INSERT INTO
    `headers` (
        `id`,
        `header_key`,
        `label`,
        `objectType`
    )
VALUES (
        20,
        'measurementRange',
        'Range of Measurement',
        'text'
    ),
    (
        21,
        'resolution',
        'Resolution',
        'text'
    ),
    (
        22,
        'calibrationStandardAccuracy',
        'Calibration Standard Accuracy (±)',
        'text'
    ),
    (
        23,
        'serialNo',
        'Serial No.',
        'text'
    ),
    (
        24,
        'registrationDate',
        'Registration Date',
        'date'
    ),
    (25, 'maker', 'Maker', 'text'),
    (
        26,
        'place',
        'Location',
        'text'
    ),
    (
        27,
        'calibrationInterval',
        'Calibration Interval',
        'text'
    ),
    (
        28,
        'calibratedBy',
        'Calibrated by',
        'text'
    ),
    (
        29,
        'lastCalibration',
        'Last Calibration',
        'date'
    ),
    (
        30,
        'nextCalibration',
        'Next Calibration Plan',
        'date'
    ),
    (
        31,
        'calibrationActualDate',
        'Actual Date Calibration',
        'date'
    );

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

--
-- Dumping data untuk tabel `insmethods`
--

INSERT INTO
    `insmethods` (
        `methodId`,
        `insId`,
        `label`,
        `logic`,
        `standard`,
        `unit`
    )
VALUES (
        15,
        6,
        'Apakah kondisi Outside Jaws tidak berkarat ,tdk lecet , rusak?',
        1,
        '["OK"]',
        NULL
    ),
    (
        16,
        7,
        'Apakah kondisi Inside Jaws tidak berkarat & tdk lecet, rusak?',
        1,
        '["OK"]',
        NULL
    ),
    (
        17,
        8,
        'Apakah kondisi Depth Bar tidak berkarat & tdk lecet, rusak?',
        1,
        '["OK"]',
        NULL
    ),
    (
        18,
        9,
        'Apakah angka pada display unit dapat terbaca jelas?',
        1,
        '["OK"]',
        NULL
    ),
    (
        19,
        11,
        'Apakah Bagian Skala Vernier dapat digeser dengan lancar?',
        1,
        '["OK"]',
        NULL
    ),
    (
        20,
        12,
        'a. Apakah pada Digital caliper tercantum sticker tanggal kalibrasi ulang ?',
        1,
        '["OK"]',
        NULL
    ),
    (
        21,
        12,
        'b. Apakah tanggal next kalibrasi pada sticker masih berlaku ?',
        1,
        '["OK"]',
        NULL
    ),
    (
        22,
        12,
        'c. Apakah sticker kalibrasi ulang masih utuh dan dapat dibaca dengan jelas ?',
        1,
        '["OK"]',
        NULL
    ),
    (
        23,
        13,
        'Apakah ada bagian Convex Scale yang rusak, pecah, hilang?',
        1,
        '["OK"]',
        NULL
    ),
    (
        24,
        14,
        'Apakah angka dan skala dapat terbaca jelas?',
        1,
        '["OK"]',
        NULL
    ),
    (
        25,
        15,
        'Apakah nomor kontrol Convex Scale terpasang dan tidak rusak?',
        1,
        '["OK"]',
        NULL
    ),
    (
        26,
        16,
        'Apakah batang penopang tidak berkarat?',
        1,
        '["OK"]',
        NULL
    ),
    (
        27,
        17,
        'Apakah jarum menunjuk ke angka 0?',
        1,
        '["OK"]',
        NULL
    ),
    (
        28,
        18,
        'Apakah dial gauge masih terbaca jelas?',
        1,
        '["OK"]',
        NULL
    ),
    (
        29,
        19,
        'Apakah handle jarum tidak kotor/berkarat?',
        1,
        '["OK"]',
        NULL
    ),
    (
        30,
        20,
        'Apakah handle jarum turun saat di tekan?',
        1,
        '["OK"]',
        NULL
    ),
    (
        31,
        20,
        'Apakah handle jarum berhenti saat di lepas?',
        1,
        '["OK"]',
        NULL
    ),
    (
        32,
        21,
        'Apakah jarum tidak berkarat, tidak patah , dan tidak ada sisa karet ?',
        1,
        '["OK"]',
        NULL
    ),
    (
        33,
        22,
        'Apakah tidak kotor/buram?',
        1,
        '["OK"]',
        NULL
    ),
    (
        34,
        23,
        'Apakah dudukan tidak kotor?',
        1,
        '["OK"]',
        NULL
    ),
    (
        35,
        24,
        'Apakah adjuster dapat berputar?',
        1,
        '["OK"]',
        NULL
    ),
    (
        36,
        25,
        'Apakah balance adjuster bisa berputar?',
        1,
        '["OK"]',
        NULL
    ),
    (
        37,
        26,
        'Apakah indicator menunjukan center?',
        1,
        '["OK"]',
        NULL
    ),
    (
        38,
        27,
        'Apakah nomor kontrol Penetro Meter   terpasang dan tidak rusak?',
        1,
        '["OK"]',
        NULL
    ),
    (
        39,
        28,
        'a. Apakah panel masih terbaca?',
        1,
        '["OK"]',
        NULL
    ),
    (
        40,
        28,
        'b. Apakah panel berfungsi?',
        1,
        '["OK"]',
        NULL
    ),
    (
        41,
        29,
        'a. Apakah lcd tidak kotor?',
        1,
        '["OK"]',
        NULL
    ),
    (
        42,
        29,
        'b. Apakah lcd menyala saat power on?',
        1,
        '["OK"]',
        NULL
    ),
    (
        43,
        30,
        'Apakah meja timbangan tidak kotor?',
        1,
        '["OK"]',
        NULL
    ),
    (
        44,
        31,
        'Apakah display menunjukkan 0 saat tombol ditekan?',
        1,
        '["OK"]',
        NULL
    ),
    (
        45,
        33,
        'Letakkan bandul 1Kg (992g) pada timbangan, pastikan perbedaan nilai aktual yang tertera dengan nilai pada bandul adalah normal 1Kg (942～1042g)',
        2,
        '["942","1042"]',
        'g'
    ),
    (
        46,
        34,
        'a. Apakah tanggal next kalibrasi pada sticker masih berlaku ?',
        1,
        '["OK"]',
        NULL
    ),
    (
        47,
        34,
        'b. Apakah sticker kalibrasi ulang masih utuh dan dapat dibaca dengan jelas ?',
        1,
        '["OK"]',
        NULL
    );

-- --------------------------------------------------------

--
-- Struktur dari tabel `inspectionitems`
--

CREATE TABLE `inspectionitems` (
    `insId` int(11) NOT NULL,
    `toolId` int(11) NOT NULL,
    `label` varchar(255) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

--
-- Dumping data untuk tabel `inspectionitems`
--

INSERT INTO
    `inspectionitems` (`insId`, `toolId`, `label`)
VALUES (6, 11, 'Outside Jaws'),
    (7, 11, 'Inside Jaws'),
    (8, 11, 'Depth Bar'),
    (9, 11, 'Display Unit'),
    (10, 11, 'Zero Origin'),
    (11, 11, 'Skala Vernier'),
    (12, 11, 'Kalibrasi'),
    (13, 12, 'Kerusakan Alat Ukur'),
    (14, 12, 'Skala Ukur'),
    (15, 12, 'Nomor Kontrol'),
    (16, 13, 'Batang penopang'),
    (
        17,
        13,
        'Jarum penunjuk dial gauge'
    ),
    (18, 13, 'Dial gauge'),
    (19, 13, 'Handle jarum '),
    (20, 13, 'Neadle releaser'),
    (21, 13, 'Jarum'),
    (22, 13, 'Mirror'),
    (23, 13, 'Dudukan test peace'),
    (24, 13, 'Adjuster '),
    (25, 13, 'Balance adjuster'),
    (26, 13, 'Balance indicator'),
    (27, 13, 'Nomor Kontrol'),
    (28, 14, 'Panel operasi'),
    (29, 14, 'Lcd display'),
    (30, 14, 'Balance base'),
    (31, 14, 'Tombol zero'),
    (33, 14, 'Weight check'),
    (34, 14, 'Kalibrasi');

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
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

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
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

-- --------------------------------------------------------

--
-- Struktur dari tabel `logics`
--

CREATE TABLE `logics` (
    `id` int(11) NOT NULL,
    `description` varchar(255) NOT NULL,
    `label` varchar(255) NOT NULL,
    `inputType` varchar(255) NOT NULL DEFAULT 'text'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

--
-- Dumping data untuk tabel `logics`
--

INSERT INTO
    `logics` (
        `id`,
        `description`,
        `label`,
        `inputType`
    )
VALUES (
        1,
        'Options that provide OK/NG buttons for determining the inspection result.',
        'OK/NG Option',
        'buttonToggle'
    ),
    (
        2,
        'Uses a range standard to determine if the input value falls within the specified minimum and maximum limits.',
        'Number Range',
        'number'
    ),
    (
        3,
        'Determines the result by checking if the input value is greater than the defined minimum standard.',
        'Larger Than (>)',
        'number'
    ),
    (
        4,
        'Compares the input value against a maximum threshold, and passes only if the value is below the defined limit.',
        'Less Than (<)',
        'number'
    ),
    (
        5,
        'Compares the input value to a defined target with upper and lower tolerance limits. The result is OK if the input falls within the range of (target - lower) to (target + upper).',
        'Upper and Lower Limit (xxx, +x, -x)',
        'number'
    ),
    (
        6,
        'Compares the input value against a minimum threshold. The result is OK if the input is greater than or equal to the specified value.',
        '≥ target',
        'number'
    ),
    (
        7,
        'Compares the input value against a maximum threshold. The result is OK if the input is less than or equal to the specified value.',
        '≤ target',
        'number'
    ),
    (
        8,
        'Performs a case-insensitive comparison between the input text and the defined standard. The result is OK if the strings match regardless of letter casing.',
        'Match Text',
        'text'
    ),
    (
        9,
        'Performs a strict comparison between the input number and the expected value. The result is OK only if both values are numerically identical.',
        'Match Number',
        'number'
    ),
    (
        10,
        'Checks if the input value is not equal to the specified value.',
        'Not Equal',
        'text'
    ),
    (
        16,
        'Options that provide OK/NG buttons for determining the inspection result, but with custom standard text.',
        'Custom OK/NG',
        'buttonToggle'
    ),
    (
        17,
        'Compares the input value to a defined target with ± tolerance limits. The result is OK if the input falls within the range of (target - lower) to (target + upper).',
        'Target ± Tolerance',
        'number'
    );

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
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

-- --------------------------------------------------------

--
-- Struktur dari tabel `notused`
--

CREATE TABLE `notused` (
    `id` int(11) NOT NULL,
    `toolId` int(11) NOT NULL,
    `date` date NOT NULL,
    `inspector` int(11) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `ranks`
--

CREATE TABLE `ranks` (
    `id` int(11) NOT NULL,
    `label` varchar(255) NOT NULL,
    `headers` text
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

--
-- Dumping data untuk tabel `ranks`
--

INSERT INTO
    `ranks` (`id`, `label`, `headers`)
VALUES (
        8,
        'Rank A',
        '[19,20,21,22,23,24,25,26,27,28,29,30,31]'
    ),
    (
        9,
        'Rank B',
        '[19,20,21,22,23,24,25,26,27,28,29,30,31]'
    ),
    (
        10,
        'Rank C',
        '[19,20,21,22,23,24,25,26,27,28,29]'
    );

-- --------------------------------------------------------

--
-- Struktur dari tabel `roleaccess`
--

CREATE TABLE `roleaccess` (
    `accessId` int(11) NOT NULL,
    `roleId` int(11) NOT NULL,
    `path` varchar(255) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

--
-- Dumping data untuk tabel `roleaccess`
--

INSERT INTO
    `roleaccess` (`accessId`, `roleId`, `path`)
VALUES (1, 1, '/dashboard'),
    (4, 3, '/dashboard'),
    (5, 3, '/setups/roles'),
    (6, 1, '/setups/users'),
    (10, 1, '/setups/roles'),
    (12, 1, '/setups/tools'),
    (14, 1, '/inspections/daily'),
    (15, 1, '/inspections/weekly'),
    (16, 1, '/inspections/monthly'),
    (
        17,
        1,
        '/inspections/abnormalities'
    ),
    (
        18,
        1,
        '/inspections/pdfreport'
    );

-- --------------------------------------------------------

--
-- Struktur dari tabel `roles`
--

CREATE TABLE `roles` (
    `roleId` int(11) NOT NULL,
    `roleName` varchar(64) NOT NULL,
    `homePage` varchar(64) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

--
-- Dumping data untuk tabel `roles`
--

INSERT INTO
    `roles` (
        `roleId`,
        `roleName`,
        `homePage`
    )
VALUES (1, 'Developer', '/dashboard'),
    (
        3,
        'Administrator',
        '/dashboard'
    );

-- --------------------------------------------------------

--
-- Struktur dari tabel `tooldata`
--

CREATE TABLE `tooldata` (
    `id` int(11) NOT NULL,
    `toolId` int(11) NOT NULL,
    `headerId` int(11) NOT NULL,
    `value` varchar(255) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

--
-- Dumping data untuk tabel `tooldata`
--

INSERT INTO
    `tooldata` (
        `id`,
        `toolId`,
        `headerId`,
        `value`
    )
VALUES (86, 11, 20, '0-150 mm'),
    (87, 11, 22, '0,05 mm'),
    (88, 11, 21, '0.01mm'),
    (89, 11, 29, '2024-09-20'),
    (90, 11, 30, ''),
    (91, 11, 31, ''),
    (92, 11, 23, 'B17058947'),
    (93, 11, 25, 'Mitutoyo'),
    (94, 11, 24, '2017-11-04'),
    (95, 11, 26, 'Inspection'),
    (96, 11, 27, 'External 1/Year'),
    (
        97,
        11,
        28,
        'PT. Sentral Tehnologi Managemen'
    ),
    (98, 12, 20, NULL),
    (99, 12, 23, NULL),
    (100, 12, 25, NULL),
    (101, 12, 24, NULL),
    (102, 12, 21, NULL),
    (103, 12, 22, NULL),
    (104, 12, 26, NULL),
    (105, 12, 27, NULL),
    (106, 12, 28, NULL),
    (107, 12, 29, NULL),
    (108, 13, 20, NULL),
    (109, 13, 21, NULL),
    (110, 13, 22, NULL),
    (111, 13, 23, NULL),
    (112, 13, 24, NULL),
    (113, 13, 25, NULL),
    (114, 13, 26, NULL),
    (115, 13, 27, NULL),
    (116, 13, 28, NULL),
    (117, 13, 29, NULL),
    (118, 13, 30, NULL),
    (119, 13, 31, NULL),
    (120, 14, 20, '0-30kg'),
    (121, 14, 21, '0.002 kg'),
    (
        122,
        14,
        22,
        'LOP Report (Good)'
    ),
    (123, 14, 25, 'Dickson'),
    (124, 14, 24, '2016-12-01'),
    (125, 14, 23, 'HTL-0468'),
    (126, 14, 30, '2025-12-10'),
    (127, 14, 31, ''),
    (
        128,
        14,
        26,
        'Hydrolik Press 1'
    ),
    (
        129,
        14,
        27,
        'External 1/Year'
    ),
    (
        130,
        14,
        28,
        'PT. Sentral Tehnologi Managemen'
    ),
    (131, 14, 29, '2024-10-25');

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
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

--
-- Dumping data untuk tabel `tools`
--

INSERT INTO
    `tools` (
        `toolId`,
        `regNumber`,
        `rankId`,
        `toolName`,
        `type`,
        `status`
    )
VALUES (
        11,
        'SPI-CAL 1',
        8,
        'Digital Caliper',
        14,
        1
    ),
    (
        12,
        'SPI-CON 2',
        10,
        'Convex',
        13,
        1
    ),
    (
        13,
        'SPI-PENE 1',
        9,
        'Penetro Meter',
        8,
        1
    ),
    (
        14,
        'SPI-BAL 1',
        8,
        'Balance Dickson',
        16,
        1
    );

-- --------------------------------------------------------

--
-- Struktur dari tabel `types`
--

CREATE TABLE `types` (
    `id` int(11) NOT NULL,
    `label` varchar(255) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

--
-- Dumping data untuk tabel `types`
--

INSERT INTO
    `types` (`id`, `label`)
VALUES (6, 'Thickness Gauge'),
    (
        7,
        'Scale Thickness Scale Width'
    ),
    (8, 'Scale Hardness'),
    (9, 'Scale Thickness'),
    (10, 'Pendulum test weight'),
    (
        11,
        'Calibrator (Ruler & Convex)'
    ),
    (12, 'Specification Gravity'),
    (13, 'Scale Lenght'),
    (14, 'Scale dimention'),
    (
        15,
        'Scale Tensile Strength Compression Strength'
    ),
    (16, 'Scale Weight'),
    (17, 'Lighting Check'),
    (18, 'Scale Heat Resistance'),
    (
        19,
        'Temperature Humidity Control'
    ),
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
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO
    `users` (
        `userId`,
        `userName`,
        `userNik`,
        `userPassword`,
        `roleId`
    )
VALUES (
        3,
        'Adnan',
        'system',
        '$2b$08$WK/Pmj7l2RIO8cu/OpWMd.u1ExnYhnExCqFCiLjsWI703jqj4rvla',
        1
    ),
    (
        13,
        'Admin Utama',
        'admin',
        '$2b$10$PJSqhhRmf4y0JsxMfT69y.kKXBI3OUcXiK0z.Ir4WqJ4tU5AP4q9G',
        3
    ),
    (
        14,
        'test',
        '111',
        '$2b$10$J/42iJYR11TpuBJwnin4KOdf6VQAm55h592Mm/eM3B8BV7dWSHoLG',
        3
    );

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
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

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
ALTER TABLE `headers` ADD PRIMARY KEY (`id`);

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
ALTER TABLE `logics` ADD PRIMARY KEY (`id`);

--
-- Indexes for table `monthlyconfirmation`
--
ALTER TABLE `monthlyconfirmation` ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notused`
--
ALTER TABLE `notused`
ADD PRIMARY KEY (`id`),
ADD KEY `toolId` (`toolId`),
ADD KEY `date` (`date`);

--
-- Indexes for table `ranks`
--
ALTER TABLE `ranks` ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roleaccess`
--
ALTER TABLE `roleaccess`
ADD PRIMARY KEY (`accessId`),
ADD KEY `roleId` (`roleId`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles` ADD PRIMARY KEY (`roleId`);

--
-- Indexes for table `tooldata`
--
ALTER TABLE `tooldata`
ADD PRIMARY KEY (`id`),
ADD KEY `toolId` (`toolId`);

--
-- Indexes for table `tools`
--
ALTER TABLE `tools` ADD PRIMARY KEY (`toolId`);

--
-- Indexes for table `types`
--
ALTER TABLE `types` ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
ADD PRIMARY KEY (`userId`),
ADD KEY `roleId` (`roleId`);

--
-- Indexes for table `weeklyconfirmation`
--
ALTER TABLE `weeklyconfirmation` ADD PRIMARY KEY (`id`);

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
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 32;
--
-- AUTO_INCREMENT for table `insmethods`
--
ALTER TABLE `insmethods`
MODIFY `methodId` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 48;
--
-- AUTO_INCREMENT for table `inspectionitems`
--
ALTER TABLE `inspectionitems`
MODIFY `insId` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 35;
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
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 18;
--
-- AUTO_INCREMENT for table `monthlyconfirmation`
--
ALTER TABLE `monthlyconfirmation`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `notused`
--
ALTER TABLE `notused` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `ranks`
--
ALTER TABLE `ranks`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 11;
--
-- AUTO_INCREMENT for table `roleaccess`
--
ALTER TABLE `roleaccess`
MODIFY `accessId` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 19;
--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
MODIFY `roleId` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 4;
--
-- AUTO_INCREMENT for table `tooldata`
--
ALTER TABLE `tooldata`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 132;
--
-- AUTO_INCREMENT for table `tools`
--
ALTER TABLE `tools`
MODIFY `toolId` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 15;
--
-- AUTO_INCREMENT for table `types`
--
ALTER TABLE `types`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 21;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 15;
--
-- AUTO_INCREMENT for table `weeklyconfirmation`
--
ALTER TABLE `weeklyconfirmation`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
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

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;