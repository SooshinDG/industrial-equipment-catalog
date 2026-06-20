"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export interface ProductOption {
  slug: string;
  label: string;
  category: string;
}

interface InquiryFormProps {
  products: ProductOption[];
  initialProduct?: string;
}

interface FormState {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  productSlug: string;
  quantity: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const STORAGE_KEY = "airmate:inquiries";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-()\s]{7,20}$/;

export function InquiryForm({ products, initialProduct }: InquiryFormProps) {
  const [form, setForm] = useState<FormState>({
    companyName: "",
    contactName: "",
    phone: "",
    email: "",
    productSlug: initialProduct ?? "",
    quantity: "1",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!form.companyName.trim()) next.companyName = "회사명을 입력해 주세요.";
    if (!form.contactName.trim()) next.contactName = "담당자명을 입력해 주세요.";
    if (!PHONE_RE.test(form.phone.trim()))
      next.phone = "올바른 연락처를 입력해 주세요.";
    if (!EMAIL_RE.test(form.email.trim()))
      next.email = "올바른 이메일 형식이 아닙니다.";
    const qty = Number(form.quantity);
    if (!Number.isInteger(qty) || qty < 1)
      next.quantity = "수량은 1 이상의 정수여야 합니다.";
    if (!form.message.trim()) next.message = "문의 내용을 입력해 주세요.";
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      // 첫 오류 필드로 포커스 이동
      const firstKey = Object.keys(nextErrors)[0];
      document.getElementById(`field-${firstKey}`)?.focus();
      return;
    }

    // 실제 전송 대신 localStorage에 임시 저장 (데모)
    try {
      const record = { ...form, savedAt: new Date().toISOString() };
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const list = raw ? (JSON.parse(raw) as unknown[]) : [];
      list.push(record);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // localStorage 사용 불가 환경에서도 성공 화면은 표시한다.
    }
    setSubmitted(true);
  };

  const resetForm = () => {
    setForm({
      companyName: "",
      contactName: "",
      phone: "",
      email: "",
      productSlug: "",
      quantity: "1",
      message: "",
    });
    setErrors({});
    setSubmitted(false);
  };

  const productLabel = products.find((p) => p.slug === form.productSlug)?.label;

  if (submitted) {
    return (
      <div className="rounded-sm border border-brand-200 border-l-4 border-l-emerald-500 bg-white p-6">
        <div className="flex items-center gap-2 text-emerald-700">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          <h2 className="text-base font-bold text-brand-900">
            문의가 접수되었습니다
          </h2>
        </div>
        <p className="mt-2 text-sm text-brand-500">
          담당자 확인 후 입력해 주신 연락처로 회신드립니다. 접수 내용은 아래와
          같습니다.
        </p>

        {/* 처리 결과 요약 (데이터시트 톤) */}
        <dl className="mt-4 divide-y divide-brand-100 border-y border-brand-200 text-sm">
          <Row label="회사 / 담당자">
            {form.companyName} · {form.contactName}
          </Row>
          <Row label="연락처">
            <span className="num">{form.phone}</span>
          </Row>
          <Row label="이메일">
            <span className="num">{form.email}</span>
          </Row>
          <Row label="관심 제품">{productLabel ?? "선택 안 함"}</Row>
          <Row label="수량">
            <span className="num">{form.quantity}</span>
          </Row>
        </dl>

        <p className="mt-4 text-xs text-brand-400">
          실제 문의는 전송되지 않는 데모입니다. 입력 내용은 서버로 전송되지 않고
          현재 브라우저(localStorage)에만 임시 저장됩니다.
        </p>
        <div className="mt-5">
          <button type="button" onClick={resetForm} className="btn-secondary">
            새 문의 작성
          </button>
        </div>
      </div>
    );
  }

  const productsByCategory = products.reduce<Record<string, ProductOption[]>>(
    (acc, p) => {
      (acc[p.category] ??= []).push(p);
      return acc;
    },
    {},
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* 담당자 정보 */}
      <fieldset>
        <legend className="text-sm font-bold text-brand-900">담당자 정보</legend>
        <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field
            name="companyName"
            label="회사명"
            required
            value={form.companyName}
            error={errors.companyName}
            onChange={(v) => update("companyName", v)}
          />
          <Field
            name="contactName"
            label="담당자명"
            required
            value={form.contactName}
            error={errors.contactName}
            onChange={(v) => update("contactName", v)}
          />
          <Field
            name="phone"
            label="연락처"
            type="tel"
            required
            placeholder="010-1234-5678"
            value={form.phone}
            error={errors.phone}
            onChange={(v) => update("phone", v)}
          />
          <Field
            name="email"
            label="이메일"
            type="email"
            required
            placeholder="name@company.com"
            value={form.email}
            error={errors.email}
            onChange={(v) => update("email", v)}
          />
        </div>
      </fieldset>

      {/* 문의 제품 */}
      <fieldset className="border-t border-brand-200 pt-6">
        <legend className="text-sm font-bold text-brand-900">문의 제품</legend>
        <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="field-productSlug" className="field-label">
              관심 제품
            </label>
            <select
              id="field-productSlug"
              value={form.productSlug}
              onChange={(e) => update("productSlug", e.target.value)}
              className="field-input"
            >
              <option value="">선택 안 함</option>
              {Object.entries(productsByCategory).map(([category, items]) => (
                <optgroup key={category} label={category}>
                  {items.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <Field
            name="quantity"
            label="수량"
            type="number"
            required
            min={1}
            value={form.quantity}
            error={errors.quantity}
            onChange={(v) => update("quantity", v)}
          />
        </div>

        <div className="mt-5">
          <label htmlFor="field-message" className="field-label">
            문의 내용 <span className="text-accent-600">*</span>
          </label>
          <textarea
            id="field-message"
            rows={5}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "error-message" : undefined}
            placeholder="필요한 사양, 수량, 납품 일정 등을 알려주세요."
            className="field-input"
          />
          {errors.message && (
            <p id="error-message" className="mt-1 text-sm text-red-600">
              {errors.message}
            </p>
          )}
        </div>
      </fieldset>

      <div className="flex flex-col gap-3 border-t border-brand-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-brand-400">
          <span className="text-accent-600">*</span> 표시는 필수 항목입니다.
        </p>
        <button type="submit" className="btn-primary">
          견적 문의 보내기
        </button>
      </div>
    </form>
  );
}

/** 성공 화면의 접수 요약 행 */
function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <dt className="shrink-0 text-brand-400">{label}</dt>
      <dd className="text-right font-medium text-brand-800">{children}</dd>
    </div>
  );
}

interface FieldProps {
  name: keyof FormState;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: number;
}

function Field({
  name,
  label,
  value,
  onChange,
  error,
  type = "text",
  required = false,
  placeholder,
  min,
}: FieldProps) {
  const id = `field-${name}`;
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {required && <span className="text-accent-600"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        min={min}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `error-${name}` : undefined}
        className="field-input"
      />
      {error && (
        <p id={`error-${name}`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
