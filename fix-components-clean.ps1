# Clean import path fix for components - Just insert "stackwise-demo" without changing quotes

$rootPath = "C:\Users\hp\Desktop\office\stackwise\frontend\stackwise\src\stackwise-demo\components"

Write-Host "Adding stackwise-demo to import paths in components folder..." -ForegroundColor Green
Write-Host "NO quotes will be modified" -ForegroundColor Yellow
Write-Host ""

$files = Get-ChildItem -Path $rootPath -Recurse -Include "*.tsx", "*.ts", "*.jsx", "*.js" -File
$fixedCount = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Simply insert "stackwise-demo/" after "@/" in import paths
    # This preserves whatever quotes are already there
    $content = $content -replace "@/components", "@/stackwise-demo/components"
    $content = $content -replace "@/pages", "@/stackwise-demo/pages"
    $content = $content -replace "@/hooks", "@/stackwise-demo/hooks"
    $content = $content -replace "@/lib", "@/stackwise-demo/lib"
    $content = $content -replace "@/data", "@/stackwise-demo/data"
    $content = $content -replace "@/config", "@/stackwise-demo/config"
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Cyan
        $fixedCount++
    }
}

Write-Host ""
Write-Host "Complete!" -ForegroundColor Green
Write-Host "Files fixed: $fixedCount" -ForegroundColor Cyan
Write-Host "Only paths changed - all quotes preserved" -ForegroundColor Yellow

