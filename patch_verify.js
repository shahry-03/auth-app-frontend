const fs = require('fs');
const file = 'src/app/(auth)/verify-email/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add map outside the component
const mapDecl = `import { apiClient } from "@/lib/api-client";\n\nconst activeVerifications = new Map<string, Promise<any>>();`;
content = content.replace('import { apiClient } from "@/lib/api-client";', mapDecl);

// Replace useEffect
const oldEffect = `  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing from the URL.");
      return;
    }

    hasFired.current = true;
    let mounted = true;
    
    const verifyToken = async () => {
      try {
        await apiClient.post("/auth/verify-email", { token });
        if (mounted) {
          setStatus("success");
          setMessage("Your email has been successfully verified!");
          toast.success("Email verified successfully");
          
          setTimeout(() => {
            if (mounted) router.push("/login");
          }, 2000);
        }
      } catch (err) {
        if (mounted) {
          const axiosError = err as AxiosError<{ message?: string }>;
          setStatus("error");
          setMessage(
            axiosError.response?.data?.message || 
            "The verification link is invalid or has expired."
          );
        }
      }
    };

    verifyToken();
    return () => { mounted = false; };
  }, [token, router]);`;

const newEffect = `  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing from the URL.");
      return;
    }

    const verifyToken = async () => {
      try {
        if (!activeVerifications.has(token)) {
          activeVerifications.set(token, apiClient.post("/auth/verify-email", { token }));
        }
        await activeVerifications.get(token);
        
        setStatus("success");
        setMessage("Your email has been successfully verified!");
        
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (err) {
        activeVerifications.delete(token);
        const axiosError = err as AxiosError<{ message?: string }>;
        setStatus("error");
        setMessage(
          axiosError.response?.data?.message || 
          "The verification link is invalid or has expired."
        );
      }
    };

    verifyToken();
  }, [token, router]);`;

content = content.replace(oldEffect, newEffect);

fs.writeFileSync(file, content, 'utf8');
console.log('Patched verify-email page.tsx');
