# Uptime Monitoring Configuration
# Using UptimeRobot for monitoring

# Monitors to configure:
# 1. Main Website: https://ghaim-uae.com
#    - HTTP(s) monitoring
#    - Check interval: 1 minute
#    - Alerts: Email, Slack webhook
#
# 2. API Health: https://ghaim-uae.com/api/health
#    - HTTP(s) monitoring  
#    - Check interval: 5 minutes
#    - Response time threshold: 2000ms
#
# 3. Critical Path: https://ghaim-uae.com/contact
#    - HTTP(s) monitoring
#    - Check interval: 1 minute
#    - Keyword check: "Contact" (ensures page loads correctly)

# Alert Configuration:
# - Email alerts to: devops@ghaim-uae.com
# - Slack webhook to: #uptime-alerts
# - Response time alert: >2000ms for 3 consecutive checks
# - Uptime alert: <99.5% over 30 days

# SLA Targets:
# - Uptime: 99.9% monthly
# - Response time: <1000ms average
# - Error rate: <0.5% requests

# Integration with Monitoring Dashboard:
# Status Page: https://status.ghaim-uae.com
# Grafana Dashboard: https://grafana.ghaim-uae.com
# PagerDuty Integration: Critical alerts only