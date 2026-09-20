package database

import(
	"database/sql"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"sort"

	_ "modernc.org/sqlite"
)

func InitDB(dbPath string) (*sql.DB, error){
	db, err:= sql.Open("sqlite", dbPath+"?_pragma=foreign_keys(1)") // activating foreign key in sqlite
	if err != nil{
		return nil, err
	}
	if err := db.Ping(); err != nil{
		return nil, err
	}

	runMigrations(db)
	return db, nil
}

func runMigrations(db *sql.DB){
	log.Println("Running migrations...")
	var files []string
	filepath.WalkDir("./migrations", func(path string, d fs.DirEntry, err error) error{
		if !d.IsDir() && filepath.Ext(path) == ".sql"{
			files = append(files, path)
		}
		return nil
	})
	sort.Strings(files)

	for _, file := range files{
		content, err := os.ReadFile(file)
		if err != nil{
			log.Fatalf("Failed to read migration file %s: %v", file, err)
		}
		_, err = db.Exec(string(content))
		if err != nil{
			log.Printf("Migrations of %s has been executed (or already applied)", file)
		}
	}
	log.Println("Migrations completed.")
}