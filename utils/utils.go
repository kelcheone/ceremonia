package utils

import (
	"archive/zip"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"time"
)

// ZipDirectory compresses a directory into a zip file
func ZipDirectory(sourceDir, outputZip string) error {
	zipFile, err := os.Create(outputZip)
	if err != nil {
		return fmt.Errorf("could create the output zip file: %s", err.Error())
	}
	defer zipFile.Close()

	zipWriter := zip.NewWriter(zipFile)
	defer zipWriter.Close()

	err = filepath.Walk(sourceDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			if path == sourceDir {
				return nil
			}
			relPath, err := filepath.Rel(filepath.Dir(sourceDir), path)
			if err != nil {
				return err
			}
			_, err = zipWriter.Create(relPath + "/")
			return err
		}
		relPath, err := filepath.Rel(filepath.Dir(sourceDir), path)
		if err != nil {
			return err
		}
		file, err := os.Open(path)
		if err != nil {
			return err
		}
		defer file.Close()

		writer, err := zipWriter.Create(relPath)
		if err != nil {
			return err
		}
		_, err = io.Copy(writer, file)
		return err
	})
	return err
}

// Mkdir creates a directory if it does not exist
func Mkdir(paht string) error {
	if err := os.MkdirAll(paht, 0755); err != nil {
		return fmt.Errorf("could not create directory: %s", err)
	}
	return nil
}

// GetTimeStamp returns the current time in a specific format
func GetTimeStamp() string {
	return time.Now().Format("2006-01-02--15-04-05.000000")
}

// DeleteFiles deletes the files in the output directory
func DeleteFiles(sessionID string) error {
	sourceDir := filepath.Join("output", sessionID)
	if err := os.RemoveAll(sourceDir); err != nil {
		return fmt.Errorf("could not delete the output directory: %s", err)
	}
	// also the config fils
	configDir := filepath.Join("config", sessionID)
	if err := os.RemoveAll(configDir); err != nil {
		return fmt.Errorf("could not delete the config directory: %s", err)
	}
	// remove the initiator log file "./initiator_logs/sessionID.log"
	logFile := filepath.Join("initiator_logs", sessionID+".log")
	if err := os.Remove(logFile); err != nil {
		return fmt.Errorf("could not delete the log file: %s", err)
	}
	return nil
}
