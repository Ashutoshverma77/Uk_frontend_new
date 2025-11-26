"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import {
  getLoggedInUserApi,
  type LoggedInUser,
} from "@/lib/api";

type TabId = "profile" | "orders" | "reorders";

function formatDate(iso?: string) {
  if (!iso) return "Not set";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Not set";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [user, setUser] = useState<LoggedInUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // Try fresh data from /users/me
        const me = await getLoggedInUserApi();
        if (!cancelled) {
          setUser(me);
          if (typeof window !== "undefined") {
            window.localStorage.setItem("pharmacy_user", JSON.stringify(me));
          }
        }
      } catch {
        // Fallback to localStorage if API fails (no token, network, etc.)
        if (typeof window !== "undefined") {
          const rawUser = window.localStorage.getItem("pharmacy_user");
          if (rawUser && !cancelled) {
            try {
              setUser(JSON.parse(rawUser));
            } catch {
              // ignore parse errors
            }
          }
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const fullName =
    user?.firstName || user?.lastName
      ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
      : "Your profile";

  return (
    <section className="bg-pharmacy-bg py-10 md:py-14 min-h-full">
      <Container>
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-5 text-xs text-slate-700 shadow-soft-card md:p-7 md:text-sm">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                My account
              </p>
              <h1 className="mt-1 text-lg font-semibold text-slate-900 md:text-xl">
                {fullName}
              </h1>
              <p className="text-xs text-slate-500">
                View and manage your personal details and orders.
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-5 flex flex-wrap gap-2 rounded-full bg-slate-50 p-1 text-[11px] text-slate-600">
            {[
              { id: "profile", label: "Profile" },
              { id: "orders", label: "My orders" },
              { id: "reorders", label: "Re-orders" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`flex-1 rounded-full px-3 py-1.5 text-center font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white shadow"
                      : "bg-transparent text-slate-600 hover:bg-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              {!user ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                  You&apos;re not logged in. Please log in to see your profile
                  details.
                </div>
              ) : (
                <>
                  {/* Basic details */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-slate-500">
                        Name
                      </p>
                      <p className="text-sm text-slate-900">
                        {fullName || "Not set"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-slate-500">
                        Email
                      </p>
                      <p className="text-sm text-slate-900">
                        {user.email || "Not set"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-slate-500">
                        Phone
                      </p>
                      <p className="text-sm text-slate-900">
                        {user.phone || "Not set"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-slate-500">
                        Gender
                      </p>
                      <p className="text-sm text-slate-900">
                        {user.gender || "Not set"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-slate-500">
                        Date of birth
                      </p>
                      <p className="text-sm text-slate-900">
                        {formatDate(user.dob)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-slate-500">
                        Joined
                      </p>
                      <p className="text-sm text-slate-900">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-slate-500">
                        Address line 1
                      </p>
                      <p className="text-sm text-slate-900">
                        {user.address_line1 || "Not set"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-slate-500">
                        Address line 2
                      </p>
                      <p className="text-sm text-slate-900">
                        {user.address_line2 || "Not set"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-slate-500">
                        City
                      </p>
                      <p className="text-sm text-slate-900">
                        {user.city || "Not set"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-slate-500">
                        County
                      </p>
                      <p className="text-sm text-slate-900">
                        {user.county || "Not set"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-slate-500">
                        Postcode
                      </p>
                      <p className="text-sm text-slate-900">
                        {user.postalcode || "Not set"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-slate-500">
                        Country
                      </p>
                      <p className="text-sm text-slate-900">
                        {user.country || "Not set"}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] text-slate-500">
                    If any of your details are incorrect, please contact the
                    pharmacy team so we can update your records.
                  </p>
                </>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
              <p className="font-semibold text-slate-900">My orders</p>
              <p className="mt-1">
                You don&apos;t have any orders yet. Once you place an order
                through Pharmacy Express, it will appear here with its status
                and tracking information.
              </p>
            </div>
          )}

          {activeTab === "reorders" && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
              <p className="font-semibold text-slate-900">Re-orders</p>
              <p className="mt-1">
                Your repeating treatments and quick reorder options will show
                here. You can return later to reorder weight management or other
                treatments that your prescriber has approved.
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
