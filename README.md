# cidm-auth0-test-harness

This repo stores the Auth0 CIDM NEO test scripts and client samples.
The structure of the repo is as follows;

```
▾ □ https://qld-gov-au.github.io/cidm-auth0-test-harness
    ▾ □ <customer>=OSSIO
        ▾ □ <project>=CIDM-NEO
            ▾ □ <product>=profile
                ▾ □ <version>=latest
                    - □ <environment>=DEV/TST/UAT/PRD
                
```

## version format

${major}.${minor}.${build_number}_${datestamp}

datestamp;
```bash
date +%Y%m%dT%H%M%S
```

Examples;
```
latest
0.0.1_20170615T122400
0.0.2_20170615T122400
```

