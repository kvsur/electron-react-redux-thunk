rem Created by LeeCH at September 5th, 2019 1:36pm
@echo off

set uninstaller="Uninstall znkf_teaching.exe"

if exist ..\..\%uninstaller% (
    start ..\..\%uninstaller%
) else (
    echo "Here no found uninstaller exe"
)

exit
