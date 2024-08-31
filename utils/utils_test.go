package utils

import (
	"archive/zip"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

func TestDeleteFiles(t *testing.T) {
	sessionID := "testsession"
	outputDir := filepath.Join("output", sessionID)
	configDir := filepath.Join("config", sessionID)

	err := os.MkdirAll(outputDir, 0755)
	require.NoError(t, err)
	err = os.MkdirAll(configDir, 0755)
	require.NoError(t, err)

	// Create dummy files
	_, err = os.Create(filepath.Join(outputDir, "dummy.txt"))
	require.NoError(t, err)
	_, err = os.Create(filepath.Join(configDir, "dummy.txt"))
	require.NoError(t, err)

	err = DeleteFiles(sessionID)
	require.NoError(t, err)

	_, err = os.Stat(outputDir)
	require.True(t, os.IsNotExist(err))
	_, err = os.Stat(configDir)
	require.True(t, os.IsNotExist(err))
}

func TestZipDirectory(t *testing.T) {
	sourceDir, err := os.MkdirTemp("", "source")
	require.NoError(t, err)
	fmt.Println(sourceDir)
	defer os.RemoveAll(sourceDir)

	outputZip := filepath.Join(os.TempDir(), "output.zip")
	defer os.Remove(outputZip)

	_, err = os.Create(filepath.Join(sourceDir, "dummy.txt"))
	require.NoError(t, err)

	err = ZipDirectory(sourceDir, outputZip)
	require.NoError(t, err)

	zipReader, err := zip.OpenReader(outputZip)
	require.NoError(t, err)
	defer zipReader.Close()

	found := false

	for _, file := range zipReader.File {
		flStore := strings.Split(file.Name, "/")[0]
		if file.Name == flStore+"/dummy.txt" {
			found = true
			break
		}
	}
	require.True(t, found)
}

func TestMkdir(t *testing.T) {
	dir := filepath.Join(os.TempDir(), "testdir")
	defer os.RemoveAll(dir)

	err := Mkdir(dir)
	require.NoError(t, err)

	info, err := os.Stat(dir)
	require.NoError(t, err)
	require.True(t, info.IsDir())
}

func TestGetTimeStamp(t *testing.T) {
	timestamp := GetTimeStamp()

	_, err := time.Parse("2006-01-02--15-04-05.000000", timestamp)
	require.NoError(t, err)
}
