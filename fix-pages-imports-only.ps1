# PowerShell script to ONLY fix import paths in pages folder
# Does NOT modify any other code

$rootPath = "C:\Users\hp\Desktop\office\stackwise\frontend\stackwise\src\stackwise-demo\pages"

Write-Host "Fixing ONLY import paths in pages folder..." -ForegroundColor Green
Write-Host "NO other code will be modified" -ForegroundColor Yellow
Write-Host ""

# Get all TypeScript and JavaScript files in pages folder
$files = Get-ChildItem -Path $rootPath -Recurse -Include "*.tsx", "*.ts", "*.jsx", "*.js" -File

$fixedCount = 0

foreach ($file in $files) {
    $lines = Get-Content $file.FullName
    $modified = $false
    $newLines = @()
    
    foreach ($line in $lines) {
        $originalLine = $line
        
        # ONLY fix import/from statements - nothing else
        # Only modify lines that start with 'import' or contain 'from'
        if ($line -match '^\s*import\s+' -or $line -match '\s+from\s+') {
            # Fix: @/components → @/stackwise-demo/components (with double quotes both sides)
            $line = $line -replace "from\s+['""]@/components([^'""]*)['""]", "from `"@/stackwise-demo/components`$1`""
            $line = $line -replace "import\s+['""]@/components([^'""]*)['""]", "import `"@/stackwise-demo/components`$1`""
            
            # Fix: @/pages → @/stackwise-demo/pages
            $line = $line -replace "from\s+['""]@/pages", "from `"@/stackwise-demo/pages"
            
            # Fix: @/hooks → @/stackwise-demo/hooks
            $line = $line -replace "from\s+['""]@/hooks", "from `"@/stackwise-demo/hooks"
            
            # Fix: @/lib → @/stackwise-demo/lib
            $line = $line -replace "from\s+['""]@/lib", "from `"@/stackwise-demo/lib"
            
            # Fix: @/data → @/stackwise-demo/data
            $line = $line -replace "from\s+['""]@/data", "from `"@/stackwise-demo/data"
            
            # Fix: @/config → @/stackwise-demo/config
            $line = $line -replace "from\s+['""]@/config", "from `"@/stackwise-demo/config"
        }
        
        if ($line -ne $originalLine) {
            $modified = $true
        }
        
        $newLines += $line
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $newLines
        Write-Host "Fixed imports: $($file.Name)" -ForegroundColor Cyan
        $fixedCount++
    }
}

Write-Host ""
Write-Host "Import path fixes complete!" -ForegroundColor Green
Write-Host "Files modified: $fixedCount" -ForegroundColor Cyan
Write-Host "ONLY import paths were changed - all other code untouched" -ForegroundColor Yellow

