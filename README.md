CRON JOB (every 8 hrs)
        ↓
Fetch latest API response
        ↓
Delete/overwrite previous Redis data
        ↓
Store latest response
        ↓
Users read latest cached snapshot