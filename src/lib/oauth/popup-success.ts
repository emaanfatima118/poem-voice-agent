/**
 * OAuth Popup Success HTML Template
 * Reusable success page for OAuth callbacks that closes popup and notifies parent
 */

export function getOAuthSuccessHTML(platform: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Authorization Successful</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            text-align: center;
            padding: 2rem;
            background: white;
            border-radius: 1rem;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 400px;
          }
          .checkmark {
            width: 80px;
            height: 80px;
            margin: 0 auto 1.5rem;
            border-radius: 50%;
            background: #10b981;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: scaleIn 0.3s ease-out;
          }
          .checkmark svg {
            width: 48px;
            height: 48px;
            stroke: white;
            stroke-width: 3;
            stroke-linecap: round;
            stroke-linejoin: round;
            fill: none;
            animation: drawCheck 0.5s ease-out 0.3s forwards;
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
          }
          @keyframes scaleIn {
            from { transform: scale(0); }
            to { transform: scale(1); }
          }
          @keyframes drawCheck {
            to { stroke-dashoffset: 0; }
          }
          h1 {
            margin: 0 0 0.5rem;
            color: #1f2937;
            font-size: 1.5rem;
          }
          p {
            margin: 0;
            color: #6b7280;
            font-size: 0.95rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="checkmark">
            <svg viewBox="0 0 52 52">
              <polyline points="14 27 22 35 38 19" />
            </svg>
          </div>
          <h1>Authorization Successful!</h1>
          <p>This window will close automatically...</p>
        </div>
        <script>
          (function() {
            const platform = '${platform}';
            let attempts = 0;
            const maxAttempts = 5;
            
            function notifyParent() {
              if (window.opener && !window.opener.closed) {
                try {
                  window.opener.postMessage(
                    { type: 'oauth_success', platform: platform }, 
                    window.location.origin
                  );
                  console.log('Posted success message to parent for platform:', platform);
                  return true;
                } catch (e) {
                  console.error('Failed to post message:', e);
                  return false;
                }
              }
              return false;
            }
            
            // Try to notify parent multiple times
            const notifyInterval = setInterval(() => {
              attempts++;
              const success = notifyParent();
              
              if (success || attempts >= maxAttempts) {
                clearInterval(notifyInterval);
                // Close window after short delay
                setTimeout(() => {
                  window.close();
                }, 500);
              }
            }, 100);
            
            // Fallback: redirect if window doesn't close
            setTimeout(() => {
              if (!window.closed) {
                window.location.href = '/integrations?success=' + platform + '_connected';
              }
            }, 3000);
          })();
        </script>
      </body>
    </html>
  `;
}
