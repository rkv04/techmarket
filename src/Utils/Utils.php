<?php

namespace App\Utils;

use App\Exceptions\ValidationException;

class Utils {
    public static function getBcryptHash($password) {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
    }

    public static function compressAndSaveImage($srcImagePath, $destDir, $maxWidth, $maxHeight, $quality) {
        list($originalWidth, $originalHeight, $type) = getimagesize($srcImagePath);
        $ratio = $originalWidth / $originalHeight;
        if ($maxWidth / $maxHeight > $ratio) {
            $newWidth = $maxHeight * $ratio;
            $newHeight = $maxHeight;
        } else {
            $newWidth = $maxWidth;
            $newHeight = $maxWidth / $ratio;
        }
        $newWidth = (int)round($newWidth);
        $newHeight = (int)round($newHeight);
        $newImage = imagecreatetruecolor($newWidth, $newHeight);
        $srcImage = match ($type) {
            IMAGETYPE_JPEG => imagecreatefromjpeg($srcImagePath),
            IMAGETYPE_PNG => imagecreatefrompng($srcImagePath)
        };
        imagecopyresampled($newImage, $srcImage, 0, 0, 0, 0, $newWidth, $newHeight, $originalWidth, $originalHeight);
        $extension = pathinfo($srcImagePath, PATHINFO_EXTENSION);
        $basename = bin2hex(random_bytes(8));
        $timestamp = time();
        $filename = sprintf('%s%s.%s', $basename, $timestamp, $extension);
        $outputPath = $destDir . $filename;
        match ($type) {
            IMAGETYPE_JPEG => imagejpeg($newImage, $outputPath, $quality),
            IMAGETYPE_PNG => imagepng($newImage, $outputPath, round(9 * (100 - $quality) / 100))
        };
        imagedestroy($newImage);
        imagedestroy($srcImage);

        return ["filename" => $filename, "path" => $outputPath];
    }

    public static function addWatermark($srcImagePath, $watermarkPath) {
        list($originalWidth, $originalHeight, $type) = getimagesize($srcImagePath);
        $srcImage = match ($type) {
            IMAGETYPE_JPEG => imagecreatefromjpeg($srcImagePath),
            IMAGETYPE_PNG => imagecreatefrompng($srcImagePath)
        };
        $watermark = imagecreatefrompng($watermarkPath);
        imagealphablending($watermark, false);
        imagesavealpha($watermark, true);
        $sourceWidth = imagesx($srcImage);
        $sourceHeight = imagesy($srcImage);
        $watermarkWidth = imagesx($watermark);
        $watermarkHeight = imagesy($watermark);
        $stepX = $watermarkWidth;
        $stepY = $watermarkHeight;
        for ($x = 0; $x < $sourceWidth; $x += $stepX) {
            for ($y = 0; $y < $sourceHeight; $y += $stepY) {
                imagecopy($srcImage, $watermark, $x, $y, 0, 0, $watermarkWidth, $watermarkHeight);
            }
        }
        match ($type) {
            IMAGETYPE_JPEG => imagejpeg($srcImage, $srcImagePath, 90),
            IMAGETYPE_PNG => imagepng($srcImage, $srcImagePath)
        };
        imagedestroy($srcImage);
        imagedestroy($watermark);
    }

    public static function moveImage($image, $destDir) {
        $extension = pathinfo($image->getClientFileName(), PATHINFO_EXTENSION);
        $basename = bin2hex(random_bytes(8));
        $timestamp = time();
        $filename = sprintf('%s%s.%s', $basename, $timestamp, $extension);
        $imagePath = $destDir . $filename;
        $image->moveTo($imagePath);
        return ["filename" => $filename, "path" => $imagePath];
    }
}

