-- Create tables for abnormality report phases

-- Phase 2: Quality Control Actions
CREATE TABLE IF NOT EXISTS `abnormalreport_phase2` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `abId` int(11) NOT NULL,
    `actToProducts` text NOT NULL,
    `actToTools` varchar(255) DEFAULT NULL COMMENT 'disposal,repaired',
    `qcActionNote` text NOT NULL,
    `qcPIC` int(11) DEFAULT NULL,
    `qcActionDate` date DEFAULT NULL,
    `qcMgr` int(11) DEFAULT NULL,
    `qcMgrDate` date DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `abId` (`abId`),
    FOREIGN KEY (`abId`) REFERENCES `abnormalreport_prod` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`qcPIC`) REFERENCES `users` (`userId`) ON DELETE RESTRICT,
    FOREIGN KEY (`qcMgr`) REFERENCES `users` (`userId`) ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

-- Phase 3: Production Confirmation
CREATE TABLE IF NOT EXISTS `abnormalreport_phase3` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `abId` int(11) NOT NULL,
    `prodConfirmNote` text NOT NULL,
    `prodConfirmator` int(11) NOT NULL,
    `prodConfirmDate` date NOT NULL,
    PRIMARY KEY (`id`),
    KEY `abId` (`abId`),
    FOREIGN KEY (`abId`) REFERENCES `abnormalreport_prod` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`prodConfirmator`) REFERENCES `users` (`userId`) ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

-- Phase 4: QC Final Confirmation
CREATE TABLE IF NOT EXISTS `abnormalreport_phase4` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `abId` int(11) NOT NULL,
    `qcConfirmNote` text NOT NULL,
    `qcMgr` int(11) DEFAULT NULL,
    `qcMgrDate` date DEFAULT NULL,
    `qcConfirmator` int(11) DEFAULT NULL,
    `qcConfirmDate` date DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `abId` (`abId`),
    FOREIGN KEY (`abId`) REFERENCES `abnormalreport_prod` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`qcMgr`) REFERENCES `users` (`userId`) ON DELETE RESTRICT,
    FOREIGN KEY (`qcConfirmator`) REFERENCES `users` (`userId`) ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = latin1;