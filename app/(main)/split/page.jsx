"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, IndianRupee, Users, Calculator, MessageCircle, RotateCcw } from "lucide-react";
import { openWhatsAppPayment } from "@/lib/upi";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Send } from "lucide-react";
import { useFormPersistence } from "@/hooks/use-form-persistence";

// Form validation schema
const splitExpenseSchema = z.object({
  totalAmount: z.string().min(1, "Amount is required").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    "Amount must be a positive number"
  ),
  requesterName: z.string().min(1, "Requester name is required"),
  requesterUpiId: z.string().min(1, "Requester UPI ID is required").refine(
    (val) => val.includes("@"),
    "Invalid UPI ID format (must include @)"
  ),
  description: z.string().min(1, "Description is required"),
  participants: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      phoneNumber: z.string().min(1, "Phone number is required"),
    })
  ).min(1, "At least one participant is required"),
});

export default function SplitExpensePage() {
  const { user } = useUser();
  const defaultRequesterName = user?.fullName || user?.firstName || "";
  
  // Form persistence - automatically saves and restores form data
  const [persistedData, updatePersistedData, clearPersistedData] = useFormPersistence(
    "split-expense-form",
    {
      totalAmount: "",
      requesterName: defaultRequesterName,
      requesterUpiId: "",
      description: "",
      participants: [{ name: "", phoneNumber: "" }],
      paymentStatus: {},
    }
  );

  const [participants, setParticipants] = useState(
    persistedData.participants || [{ name: "", phoneNumber: "" }]
  );
  const [paymentStatus, setPaymentStatus] = useState(
    persistedData.paymentStatus || {}
  );
  const [splitAmount, setSplitAmount] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(splitExpenseSchema),
    defaultValues: {
      totalAmount: persistedData.totalAmount || "",
      requesterName: persistedData.requesterName || defaultRequesterName,
      requesterUpiId: persistedData.requesterUpiId || "",
      description: persistedData.description || "",
      participants: persistedData.participants || [{ name: "", phoneNumber: "" }],
    },
  });

  const totalAmount = watch("totalAmount");
  const requesterName = watch("requesterName");
  const requesterUpiId = watch("requesterUpiId");
  const description = watch("description");

  // Save form data to persistence whenever values change
  useEffect(() => {
    updatePersistedData({
      totalAmount,
      requesterName,
      requesterUpiId,
      description,
      participants,
      paymentStatus,
    });
  }, [totalAmount, requesterName, requesterUpiId, description, participants, paymentStatus, updatePersistedData]);

  // Real-time split calculation - updates when participants are added/removed or total amount changes
  useEffect(() => {
    const amount = parseFloat(totalAmount) || 0;
    // Count only participants with names (valid participants)
    const validParticipants = participants.filter((p) => p.name.trim() !== "");
    const count = validParticipants.length || 1;
    const calculatedSplit = count > 0 ? amount / count : 0;
    setSplitAmount(calculatedSplit);
  }, [totalAmount, participants]);

  const addParticipant = () => {
    setParticipants([...participants, { name: "", phoneNumber: "" }]);
  };

  const removeParticipant = (index) => {
    if (participants.length > 1) {
      const updated = participants.filter((_, i) => i !== index);
      setParticipants(updated);
      // Clear payment status for removed participant
      setPaymentStatus((prev) => {
        const newStatus = { ...prev };
        delete newStatus[index];
        // Reindex remaining statuses
        const reindexed = {};
        Object.keys(newStatus).forEach((key) => {
          const keyNum = parseInt(key);
          if (keyNum > index) {
            reindexed[keyNum - 1] = newStatus[key];
          } else if (keyNum < index) {
            reindexed[keyNum] = newStatus[key];
          }
        });
        return reindexed;
      });
    }
  };

  const updateParticipant = (index, field, value) => {
    const updated = participants.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    );
    setParticipants(updated);
  };

  const handleRequestViaWhatsApp = (participant, index) => {
    if (!requesterName || !requesterUpiId) {
      toast.error("Please fill in requester name and UPI ID");
      return;
    }

    if (!participant.name) {
      toast.error("Please fill in participant name");
      return;
    }

    if (!participant.phoneNumber) {
      toast.error("Please fill in phone number to send WhatsApp message");
      return;
    }

    try {
      // Use requester's UPI ID and name for all WhatsApp requests
      openWhatsAppPayment(
        participant.phoneNumber,
        participant.name,
        requesterName,
        splitAmount, // Use current calculated split amount
        description || "Split expense",
        requesterUpiId // Requester's UPI ID receives all payments
      );
      
      // Mark as requested
      setPaymentStatus((prev) => ({
        ...prev,
        [index]: "requested",
      }));
      
      toast.success(`Opening WhatsApp to send payment request to ${participant.name}`);
    } catch (error) {
      toast.error(error.message || "Failed to open WhatsApp");
    }
  };

  // Clear all form data (useful after successful submission or cancel)
  const handleClearForm = () => {
    clearPersistedData();
    setParticipants([{ name: "", phoneNumber: "" }]);
    setPaymentStatus({});
    reset({
      totalAmount: "",
      requesterName: defaultRequesterName,
      requesterUpiId: "",
      description: "",
      participants: [{ name: "", phoneNumber: "" }],
    });
    toast.success("Form cleared");
  };

  const handleMarkPaid = (index) => {
    setPaymentStatus((prev) => ({
      ...prev,
      [index]: "paid",
    }));
    toast.success("Marked as paid");
  };

  const getPaymentStatus = (index) => {
    return paymentStatus[index] || "pending";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "requested":
        return <Send className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "requested":
        return <Badge className="bg-blue-100 text-blue-800">Requested</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-5xl gradient-title mb-2">Split Expense</h1>
          <p className="text-muted-foreground">
            Split expenses with friends and request payments via WhatsApp
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearForm}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Clear Form
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Expense Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Requester Details */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
              <h3 className="font-semibold text-sm text-blue-900">Payment Receiver</h3>
              
              <div className="space-y-2">
                <Label htmlFor="requesterName">Your Name</Label>
                <Input
                  id="requesterName"
                  placeholder="Your name"
                  {...register("requesterName")}
                />
                {errors.requesterName && (
                  <p className="text-sm text-red-500">
                    {errors.requesterName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="requesterUpiId">Your UPI ID</Label>
                <Input
                  id="requesterUpiId"
                  placeholder="yourname@paytm"
                  {...register("requesterUpiId")}
                />
                {errors.requesterUpiId && (
                  <p className="text-sm text-red-500">
                    {errors.requesterUpiId.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  This UPI ID will receive all payments
                </p>
              </div>
            </div>

            {/* Total Amount */}
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="totalAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("totalAmount")}
                  onChange={(e) => {
                    setValue("totalAmount", e.target.value);
                  }}
                  className="pl-10"
                />
              </div>
              {errors.totalAmount && (
                <p className="text-sm text-red-500">
                  {errors.totalAmount.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Dinner at restaurant"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Participants */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Participants
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addParticipant}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              {participants.map((participant, index) => (
                <Card key={index} className="p-4 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Person {index + 1}
                    </span>
                    {participants.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeParticipant(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Input
                      placeholder="Participant Name"
                      value={participant.name}
                      onChange={(e) => {
                        updateParticipant(index, "name", e.target.value);
                        setValue(`participants.${index}.name`, e.target.value);
                      }}
                    />
                    <Input
                      placeholder="WhatsApp Number (with country code, e.g., 919876543210)"
                      value={participant.phoneNumber || ""}
                      onChange={(e) => {
                        updateParticipant(index, "phoneNumber", e.target.value);
                        setValue(`participants.${index}.phoneNumber`, e.target.value);
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Required for WhatsApp payment requests
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Split Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Split Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {totalAmount && parseFloat(totalAmount) > 0 ? (
              <>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Total Amount
                    </span>
                    <span className="text-lg font-bold">
                      ₹{parseFloat(totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Participants
                    </span>
                    <span className="text-lg font-semibold">
                      {participants.filter((p) => p.name.trim() !== "").length || 1}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-blue-300">
                    <span className="text-sm font-medium">Per Person</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{splitAmount.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Amount updates automatically when participants are added or removed
                  </p>
                </div>

                {/* Payment Requests */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Payment Requests</h3>
                  {participants.map((participant, index) => {
                    if (!participant.name || participant.name.trim() === "") return null;
                    const status = getPaymentStatus(index);

                    return (
                      <Card key={index} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="font-medium">{participant.name}</p>
                            {participant.phoneNumber && (
                              <p className="text-xs text-muted-foreground">
                                {participant.phoneNumber}
                              </p>
                            )}
                          </div>
                          {getStatusBadge(status)}
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-muted-foreground">
                            Amount to Pay
                          </span>
                          <span className="font-semibold text-lg">
                            ₹{splitAmount.toFixed(2)}
                          </span>
                        </div>

                        {!requesterUpiId && (
                          <p className="text-xs text-red-500 mb-2">
                            Please enter requester UPI ID above
                          </p>
                        )}

                        <div className="flex gap-2">
                          {status !== "paid" && (
                            <>
                              {participant.phoneNumber ? (
                                <Button
                                  onClick={() =>
                                    handleRequestViaWhatsApp(participant, index)
                                  }
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                  size="sm"
                                  disabled={!requesterUpiId || !requesterName}
                                >
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Send via WhatsApp
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  className="flex-1"
                                  size="sm"
                                  disabled
                                >
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Add Phone Number
                                </Button>
                              )}
                            </>
                          )}
                          {status === "requested" && (
                            <Button
                              onClick={() => handleMarkPaid(index)}
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Mark Paid
                            </Button>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">
                  Enter total amount to see split calculation
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
